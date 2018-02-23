module MacInstaller where

---
--- An overview of Mac .pkg internals:  http://www.peachpit.com/articles/article.aspx?p=605381&seqNum=2
---

import           Control.Monad        (unless)
import           Data.Maybe           (fromMaybe)
import           Data.Monoid          ((<>))
import qualified Data.Text            as T
import           System.Directory
import           System.Environment   (lookupEnv)
import           System.FilePath.Glob (glob)
import           Turtle               (ExitCode (..), echo, procs, shell, shells)
import           Turtle.Line          (unsafeTextToLine)

import           Launcher
import           RewriteLibs          (chain)


main :: IO ()
main = do
  version <- fromMaybe "dev" <$> lookupEnv "LUX_VERSION"

  let appRoot = "../release/darwin-x64/Lux-darwin-x64/Lux.app"
      dir     = appRoot <> "/Contents/MacOS"
      -- resDir  = appRoot <> "/Contents/Resources"
      pkg     = "dist/Lux-installer-" <> version <> ".pkg"
  createDirectoryIfMissing False "dist"

  echo "Creating icons ..."
  procs "iconutil" ["--convert", "icns", "--output", T.pack dir <> "/../Resources/electron.icns", "icons/electron.iconset"] mempty

  echo "Preparing files ..."
  copyFile "lux-launcher" (dir <> "/lux-launcher")
  copyFile "lux-node" (dir <> "/lux-node")
  copyFile "wallet-topology.yaml" (dir <> "/wallet-topology.yaml")
  copyFile "configuration.yaml" (dir <> "/configuration.yaml")
  genesisFiles <- glob "*genesis*.json"
  procs "cp" (fmap T.pack (genesisFiles <> [dir])) mempty
  copyFile "log-config-prod.yaml" (dir <> "/log-config-prod.yaml")
  copyFile "build-certificates-unix.sh" (dir <> "/build-certificates-unix.sh")
  copyFile "ca.conf"     (dir <> "/ca.conf")
  copyFile "server.conf" (dir <> "/server.conf")
  copyFile "client.conf" (dir <> "/client.conf")

  -- Rewrite libs paths and bundle them
  _ <- chain dir $ fmap T.pack [dir <> "/lux-launcher", dir <> "/lux-node"]

  -- Prepare launcher
  de <- doesFileExist (dir <> "/Frontend")
  unless de $ renameFile (dir <> "/Lux") (dir <> "/Frontend")
  run "chmod" ["+x", T.pack (dir <> "/Frontend")]
  writeFile (dir <> "/Lux") $ unlines
    [ "#!/usr/bin/env bash"
    , "cd \"$(dirname $0)\""
    , "mkdir -p \"$HOME/Library/Application Support/Lux/Secrets-1.0\""
    , "mkdir -p \"$HOME/Library/Application Support/Lux/Logs/pub\""
    , doLauncher
    ]
  run "chmod" ["+x", T.pack (dir <> "/Lux")]

  let pkgargs =
       [ "--identifier"
       , "org.lux.pkg"
       , "--scripts", "data/scripts"
       , "--component"
       , "../release/darwin-x64/Lux-darwin-x64/Lux.app"
       , "--install-location"
       , "/Applications"
       , "dist/temp.pkg"
       ]
  run "pkgbuild" pkgargs

  let productargs =
       [ "--product"
       , "data/plist"
       , "--package"
       , "dist/temp.pkg"
       , "dist/temp2.pkg"
       ]
  run "productbuild" productargs

  isPullRequest <- fromMaybe "true" <$> lookupEnv "TRAVIS_PULL_REQUEST"
  if isPullRequest == "false" then do
    -- Sign the installer with a special macOS dance
    run "security" ["create-keychain", "-p", "travis", "macos-build.keychain"]
    run "security" ["default-keychain", "-s", "macos-build.keychain"]
    exitcode <- shell "security import macos.p12 -P \"$CERT_PASS\" -k macos-build.keychain -T `which productsign`" mempty
    unless (exitcode == ExitSuccess) $ error "Signing failed"
    run "security" ["set-key-partition-list", "-S", "apple-tool:,apple:", "-s", "-k", "travis", "macos-build.keychain"]
    run "security" ["unlock-keychain", "-p", "travis", "macos-build.keychain"]
    shells ("productsign --sign \"Developer ID Installer: Input Output HK Limited (89TW38X994)\" --keychain macos-build.keychain dist/temp2.pkg " <> T.pack pkg) mempty
  else do
    echo "Pull request, not signing the installer."
    run "cp" ["dist/temp2.pkg", T.pack pkg]

  run "rm" ["dist/temp.pkg"]
  run "rm" ["dist/temp2.pkg"]

  echo $ "Generated " <> unsafeTextToLine (T.pack pkg)

doLauncher :: String
doLauncher = "./lux-launcher " <> (launcherArgs $ Launcher
  { nodePath = "./lux-node"
  , walletPath = "./Frontend"
  , nodeLogPath = appdata <> "Logs/lux-node.log"
  , launcherLogPath = appdata <> "Logs/pub/"
  , windowsInstallerPath = Nothing
  , runtimePath = appdata
  , updater =
      WithUpdater
        { updArchivePath = appdata <> "installer.pkg"
        , updExec = "/usr/bin/open"
        , updArgs = ["-FW"]
        }
  })
    where
      appdata = "$HOME/Library/Application Support/Lux/"

run :: T.Text -> [T.Text] -> IO ()
run cmd args = do
  echo . unsafeTextToLine $ T.intercalate " " (cmd : args)
  procs cmd args mempty
