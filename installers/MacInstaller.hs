{-# LANGUAGE RecordWildCards, LambdaCase #-}
module MacInstaller
    ( main
    , SigningConfig(..)
    , signingConfig
    , signInstaller
    , importCertificate
    , deleteCertificate
    , run
    , run'
    ) where

---
--- An overview of Mac .pkg internals:    http://www.peachpit.com/articles/article.aspx?p=605381&seqNum=2
---

import           Universum

import           Control.Monad (unless, liftM2)
import           Data.Maybe (fromMaybe)
import qualified Data.Text as T
import           System.Directory (copyFile, createDirectoryIfMissing, doesFileExist, renameFile)
import           System.Environment (lookupEnv)
import           System.FilePath ((</>), FilePath)
import           System.FilePath.Glob (glob)
import           Filesystem.Path.CurrentOS (encodeString)
import           Turtle (ExitCode (..), echo, proc, procs, which, Managed, with)
import           Turtle.Line (unsafeTextToLine)

import           RewriteLibs (chain)

import           System.IO (hSetBuffering, BufferMode(NoBuffering))

data InstallerConfig = InstallerConfig {
    icApi :: String
  , appNameLowercase :: T.Text
  , appName :: String
  , pkg :: T.Text
  , predownloadChain :: Bool
  , appRoot :: String
}

-- In both Travis and Buildkite, the environment variable is set to
-- the pull request number if the current job is a pull request build,
-- or "false" if it’s not.
pullRequestFromEnv :: IO (Maybe String)
pullRequestFromEnv = liftM2 (<|>) (getPR "BUILDKITE_PULL_REQUEST") (getPR "TRAVIS_PULL_REQUEST")
  where
    getPR = fmap interpret . lookupEnv
    interpret Nothing        = Nothing
    interpret (Just "false") = Nothing
    interpret (Just num)     = Just num

travisJobIdFromEnv :: IO (Maybe String)
travisJobIdFromEnv = lookupEnv "TRAVIS_JOB_ID"

installerConfigFromEnv :: IO InstallerConfig
installerConfigFromEnv = mkEnv <$> envAPI <*> envVersion
  where
    envAPI = fromMaybe "luxcoin" <$> lookupEnv "API"
    envVersion = fromMaybe "dev" <$> lookupEnv "LUXCORE_VERSION"
    mkEnv "luxcoin" ver = InstallerConfig
      { icApi = "luxcoin"
      , predownloadChain = False
      , appNameLowercase = "luxcore"
      , appName = "Luxcore"
      , pkg = "dist/Luxcore-installer-" <> T.pack ver <> ".pkg"
      , appRoot = "../release/darwin-x64/Luxcore-darwin-x64/Luxcore.app"
      }

main :: IO ()
main = do
  hSetBuffering stdout NoBuffering

  cfg <- installerConfigFromEnv
  tempInstaller <- makeInstaller cfg
  shouldSign <- shouldSignDecision

  if shouldSign
    then do
      signInstaller signingConfig (toText tempInstaller) (pkg cfg)
      checkSignature (pkg cfg)
    else do
      echo "Pull request, not signing the installer."
      run "cp" [toText tempInstaller, pkg cfg]

  -- run "rm" [toText tempInstaller]
  echo $ "Generated " <> unsafeTextToLine (pkg cfg)

-- | When on travis, only sign installer if for non-PR builds.
shouldSignDecision :: IO Bool
shouldSignDecision = do
  pr <- pullRequestFromEnv
  isTravis <- isJust <$> travisJobIdFromEnv
  pure (not isTravis || pr == Nothing)

makeScriptsDir :: InstallerConfig -> Managed T.Text
makeScriptsDir cfg = case icApi cfg of
  "luxcoin" -> pure "data/scripts"
  "etc" -> pure "[DEVOPS-533]"

makeInstaller :: InstallerConfig -> IO FilePath
makeInstaller cfg = do
  let dir     = appRoot cfg </> "Contents/MacOS"
      resDir  = appRoot cfg </> "Contents/Resources"
  createDirectoryIfMissing False "dist"

  echo "Creating icons ..."
  procs "iconutil" ["--convert", "icns", "--output", toText (resDir </> "electron.icns"), "icons/electron.iconset"] mempty

  echo "Preparing files ..."
  case icApi cfg of
    "luxcoin" -> do
      copyFile "luxd" (dir </> "luxd")

      let launcherConfigFileName = "launcher-config.yaml"
      copyFile "launcher-config-mac.yaml" (dir </> launcherConfigFileName)
      pure ()
    _ -> pure () -- DEVOPS-533

  -- Prepare launcher
  de <- doesFileExist (dir </> "Frontend")
  unless de $ renameFile (dir </> "Luxcore") (dir </> "Frontend")
  run "chmod" ["+x", toText (dir </> "Frontend")]
  writeLauncherFile dir cfg

  with (makeScriptsDir cfg) $ \scriptsDir -> do
    let
      pkgargs :: [ T.Text ]
      pkgargs =
           [ "--identifier"
           , "org." <> appNameLowercase cfg <> ".pkg"
           -- data/scripts/postinstall is responsible for running build-certificates
           -- "--scripts", scriptsDir
           , "--component"
           , T.pack $ appRoot cfg
           , "--install-location"
           , "/Applications"
           , "dist/mac_installer.pkg"
           ]
    run "ls" [ "-ltrh", scriptsDir ]
    run "pkgbuild" pkgargs

  run "productbuild" [ "--product", "data/plist"
                     , "--package", "dist/mac_installer.pkg"
                     , "dist/mac_installer_product.pkg"
                     ]

  -- run "rm" ["dist/temp.pkg"]
  pure "dist/mac_installer_product.pkg"

writeLauncherFile :: FilePath -> InstallerConfig -> IO FilePath
writeLauncherFile dir _ = do
  writeFile path $ unlines contents
  run "chmod" ["+x", toText path]
  pure path
  where
    path = dir </> "Luxcore"
    contents =
      [ "#!/usr/bin/env bash"
      , "cd \"$(dirname $0)\""
      , "mkdir -p \"$HOME/Library/Application Support/Luxcore/Secrets-1.0\""
      , "mkdir -p \"$HOME/Library/Application Support/Luxcore/Logs/pub\""
      , "(ps aux | grep \"[l]uxd\") || ./luxd -daemon -rpcuser=rpcuser -rpcpassword=rpcpwd"
      , "./Frontend"
      ]

data SigningConfig = SigningConfig
  { signingIdentity         :: T.Text
  , signingKeyChain         :: Maybe T.Text
  , signingKeyChainPassword :: Maybe T.Text
  } deriving (Show, Eq)

signingConfig :: SigningConfig
signingConfig = SigningConfig
  { signingIdentity = "Developer ID Installer: Luxcore Limited (89TW38X994)"
  , signingKeyChain = Nothing
  , signingKeyChainPassword = Nothing
  }

-- | Runs "security import -x"
importCertificate :: SigningConfig -> FilePath -> Maybe Text -> IO ExitCode
importCertificate SigningConfig{..} cert password = do
  let optArg s = map toText . maybe [] (\p -> [s, p])
      certPass = optArg "-P" password
      keyChain = optArg "-k" signingKeyChain
  productSign <- optArg "-T" . fmap (toText . encodeString) <$> which "productsign"
  let args = ["import", toText cert, "-x"] ++ keyChain ++ certPass ++ productSign
  -- echoCmd "security" args
  proc "security" args mempty

--- | Remove our certificate from the keychain
deleteCertificate :: SigningConfig -> IO ExitCode
deleteCertificate SigningConfig{..} = run' "security" args
  where
    args = ["delete-certificate", "-c", signingIdentity] ++ keychain
    keychain = maybe [] pure signingKeyChain

-- | Creates a new installer package with signature added.
signInstaller :: SigningConfig -> T.Text -> T.Text -> IO ()
signInstaller SigningConfig{..} src dst =
  run "echo" ["NOT SIGNING INSTALLER"]
  -- run "productsign" $ sign ++ [ src, dst ]
  -- where
  --   sign = [ "--sign", signingIdentity ]
    -- keychain = maybe [] (\k -> [ "--keychain", k]) signingKeyChain

-- | Use pkgutil to verify that signing worked.
checkSignature :: T.Text -> IO ()
checkSignature pkg = run "echo" ["NOT CHECKING SIGNATURE"]

-- | Print the command then run it. Raises an exception on exit
-- failure.
run :: T.Text -> [T.Text] -> IO ()
run cmd args = do
    echoCmd cmd args
    procs cmd args mempty

-- | Print the command then run it.
run' :: T.Text -> [T.Text] -> IO ExitCode
run' cmd args = do
    echoCmd cmd args
    proc cmd args mempty

echoCmd :: T.Text -> [T.Text] -> IO ()
echoCmd cmd args = echo . unsafeTextToLine $ T.intercalate " " (cmd : args)
