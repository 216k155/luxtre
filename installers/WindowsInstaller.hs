module WindowsInstaller where

import           Control.Monad      (unless)
import qualified Data.List          as L
import           Data.Maybe         (fromJust, fromMaybe)
import           Data.Monoid        ((<>))
import           Data.Text          (pack, split, unpack)
import           Development.NSIS
import           System.Directory   (doesFileExist)
import           System.Environment (lookupEnv)
import           Turtle             (ExitCode (..), echo, proc, procs)
import           Turtle.Line        (unsafeTextToLine)

import           Launcher

launcherScript :: [String]
launcherScript =
  [ "@echo off"
  , "SET LUX_DIR=%~dp0"
  , "start /D \"%LUX_DIR%\" lux-launcher.exe " <> args
  ]
  where
    args = launcherArgs $ Launcher
      { nodePath = "%LUX_DIR%\\lux-node.exe"
      , nodeLogPath = "%APPDATA%\\Lux\\Logs\\lux-node.log"
      , walletPath = "%LUX_DIR%\\Lux.exe"
      , launcherLogPath = "%APPDATA%\\Lux\\Logs\\pub"
      , windowsInstallerPath = Just "%APPDATA%\\Lux\\Installer.bat"
      , updater =
          SelfUnpacking
            { updArchivePath = "%APPDATA%\\Lux\\Installer.exe"
            , updArgs = []
            }
      , runtimePath = "%APPDATA%\\Lux\\"
      }

luxShortcut :: [Attrib]
luxShortcut =
    [ Target "$INSTDIR\\lux.bat"
    , IconFile "$INSTDIR\\Lux.exe"
    , StartOptions "SW_SHOWMINIMIZED"
    , IconIndex 0
    ]

-- See INNER blocks at http://nsis.sourceforge.net/Signing_an_Uninstaller
writeUninstallerNSIS :: String -> IO ()
writeUninstallerNSIS fullVersion = do
  tempDir <- fmap fromJust $ lookupEnv "TEMP"
  writeFile "uninstaller.nsi" $ nsis $ do
    _ <- constantStr "Version" (str fullVersion)
    name "Lux Uninstaller $Version"
    outFile . str $ tempDir <> "\\tempinstaller.exe"
    unsafeInjectGlobal "!addplugindir \"nsis_plugins\\liteFirewall\\bin\""
    unsafeInjectGlobal "SetCompress off"
    _ <- section "" [Required] $ do
      unsafeInject $ "WriteUninstaller \"" <> tempDir <> "\\uninstall.exe\""

    uninstall $ do
      -- Remove registry keys
      deleteRegKey HKLM "Software/Microsoft/Windows/CurrentVersion/Uninstall/Lux"
      deleteRegKey HKLM "Software/Lux"
      rmdir [Recursive,RebootOK] "$INSTDIR"
      delete [] "$SMPROGRAMS/Lux/*.*"
      delete [] "$DESKTOP\\Lux.lnk"
      mapM_ unsafeInject
        [ "liteFirewall::RemoveRule \"$INSTDIR\\lux-node.exe\" \"Lux Node\""
        , "Pop $0"
        , "DetailPrint \"liteFirewall::RemoveRule: $0\""
        ]
      -- Note: we leave user data alone

-- See non-INNER blocks at http://nsis.sourceforge.net/Signing_an_Uninstaller
signUninstaller :: IO ()
signUninstaller = do
  procs "C:\\Program Files (x86)\\NSIS\\makensis" ["uninstaller.nsi"] mempty
  tempDir <- fmap fromJust $ lookupEnv "TEMP"
  writeFile "runtempinstaller.bat" $ tempDir <> "\\tempinstaller.exe /S"
  _ <- proc "runtempinstaller.bat" [] mempty
  signFile (tempDir <> "\\uninstall.exe")

signFile :: FilePath -> IO ()
signFile filename = do
  exists <- doesFileExist filename
  if exists then do
    maybePass <- lookupEnv "CERT_PASS"
    case maybePass of
      Nothing -> echo . unsafeTextToLine . pack $ "Skipping signing " <> filename <> " due to lack of password"
      Just pass -> do
        echo . unsafeTextToLine . pack $ "Signing " <> filename
        -- TODO: Double sign a file, SHA1 for vista/xp and SHA2 for windows 8 and on
        --procs "C:\\Program Files (x86)\\Microsoft SDKs\\Windows\\v7.1A\\Bin\\signtool.exe" ["sign", "/f", "C:\\luxct-windows-certificate.p12", "/p", pack pass, "/t", "http://timestamp.comodoca.com", "/v", pack filename] mempty
        exitcode <- proc "C:\\Program Files (x86)\\Microsoft SDKs\\Windows\\v7.1A\\Bin\\signtool.exe" ["sign", "/f", "C:\\luxct-windows-certificate.p12", "/p", pack pass, "/fd", "sha256", "/tr", "http://timestamp.comodoca.com/?td=sha256", "/td", "sha256", "/v", pack filename] mempty
        unless (exitcode == ExitSuccess) $ error "Signing failed"
  else
    error $ "Unable to sign missing file '" <> filename <> "''"

parseVersion :: String -> [String]
parseVersion ver =
  case split (== '.') (pack ver) of
    v@[_, _, _, _] -> map unpack v
    _              -> ["0", "0", "0", "0"]

writeInstallerNSIS :: String -> IO ()
writeInstallerNSIS fullVersion = do
  tempDir <- fmap fromJust $ lookupEnv "TEMP"
  let viProductVersion = L.intercalate "." $ parseVersion fullVersion
  echo $ unsafeTextToLine $ pack $ "VIProductVersion: " <> viProductVersion
  writeFile "lux.nsi" $ nsis $ do
    _ <- constantStr "Version" (str fullVersion)
    name "Lux ($Version)"                  -- The name of the installer
    outFile "lux-win64-$Version-installer.exe"           -- Where to produce the installer
    unsafeInjectGlobal $ "!define MUI_ICON \"icons\\64x64.ico\""
    unsafeInjectGlobal $ "!define MUI_HEADERIMAGE"
    unsafeInjectGlobal $ "!define MUI_HEADERIMAGE_BITMAP \"icons\\installBanner.bmp\""
    unsafeInjectGlobal $ "!define MUI_HEADERIMAGE_RIGHT"
    unsafeInjectGlobal $ "VIProductVersion " <> viProductVersion
    unsafeInjectGlobal $ "VIAddVersionKey \"ProductVersion\" " <> fullVersion
    unsafeInjectGlobal "Unicode true"
    requestExecutionLevel Highest
    unsafeInjectGlobal "!addplugindir \"nsis_plugins\\liteFirewall\\bin\""

    installDir "$PROGRAMFILES64\\Lux"                   -- Default installation directory...
    installDirRegKey HKLM "Software/Lux" "Install_Dir"  -- ...except when already installed.

    page Directory                   -- Pick where to install
    _ <- constant "INSTALLEDAT" $ readRegStr HKLM "Software/Lux" "Install_Dir"
    onPagePre Directory (iff_ (strLength "$INSTALLEDAT" %/= 0) $ abort "")

    page InstFiles                   -- Give a progress bar while installing

    _ <- section "" [Required] $ do
        setOutPath "$INSTDIR"        -- Where to install files in this section
        writeRegStr HKLM "Software/Lux" "Install_Dir" "$INSTDIR" -- Used by launcher batch script
        createDirectory "$APPDATA\\Lux\\Secrets-1.0"
        createDirectory "$APPDATA\\Lux\\Logs"
        createDirectory "$APPDATA\\Lux\\Logs\\pub"
        createShortcut "$DESKTOP\\Lux.lnk" luxShortcut
        file [] "lux-node.exe"
        file [] "lux-launcher.exe"
        file [] "log-config-prod.yaml"
        file [] "version.txt"
        file [] "build-certificates-win64.bat"
        file [] "ca.conf"
        file [] "server.conf"
        file [] "client.conf"
        file [] "wallet-topology.yaml"
        file [] "configuration.yaml"
        file [] "*genesis*.json"
        writeFileLines "$INSTDIR\\lux.bat" (map str launcherScript)
        file [Recursive] "dlls\\"
        file [Recursive] "libressl\\"
        file [Recursive] "..\\release\\win32-x64\\Lux-win32-x64\\"

        mapM_ unsafeInject
          [ "liteFirewall::AddRule \"$INSTDIR\\lux-node.exe\" \"Lux Node\""
          , "Pop $0"
          , "DetailPrint \"liteFirewall::AddRule: $0\""
          ]

        execWait "build-certificates-win64.bat \"$INSTDIR\" >\"%APPDATA%\\Lux\\Logs\\build-certificates.log\" 2>&1"

        -- Uninstaller
        writeRegStr HKLM "Software/Microsoft/Windows/CurrentVersion/Uninstall/Lux" "InstallLocation" "$INSTDIR\\Lux"
        writeRegStr HKLM "Software/Microsoft/Windows/CurrentVersion/Uninstall/Lux" "Publisher" "LUXCT"
        writeRegStr HKLM "Software/Microsoft/Windows/CurrentVersion/Uninstall/Lux" "ProductVersion" (str fullVersion)
        writeRegStr HKLM "Software/Microsoft/Windows/CurrentVersion/Uninstall/Lux" "VersionMajor" (str . (!! 0). parseVersion $ fullVersion)
        writeRegStr HKLM "Software/Microsoft/Windows/CurrentVersion/Uninstall/Lux" "VersionMinor" (str . (!! 1). parseVersion $ fullVersion)
        writeRegStr HKLM "Software/Microsoft/Windows/CurrentVersion/Uninstall/Lux" "DisplayName" "Lux"
        writeRegStr HKLM "Software/Microsoft/Windows/CurrentVersion/Uninstall/Lux" "DisplayVersion" (str fullVersion)
        writeRegStr HKLM "Software/Microsoft/Windows/CurrentVersion/Uninstall/Lux" "UninstallString" "\"$INSTDIR/uninstall.exe\""
        writeRegStr HKLM "Software/Microsoft/Windows/CurrentVersion/Uninstall/Lux" "QuietUninstallString" "\"$INSTDIR/uninstall.exe\" /S"
        writeRegDWORD HKLM "Software/Microsoft/Windows/CurrentVersion/Uninstall/Lux" "NoModify" 1
        writeRegDWORD HKLM "Software/Microsoft/Windows/CurrentVersion/Uninstall/Lux" "NoRepair" 1
        file [] $ (str $ tempDir <> "\\uninstall.exe")

    _ <- section "Start Menu Shortcuts" [] $ do
        createDirectory "$SMPROGRAMS/Lux"
        createShortcut "$SMPROGRAMS/Lux/Uninstall Lux.lnk"
          [Target "$INSTDIR/uninstall.exe", IconFile "$INSTDIR/uninstall.exe", IconIndex 0]
        createShortcut "$SMPROGRAMS/Lux/Lux.lnk" luxShortcut
    return ()

main :: IO ()
main = do
  echo "Writing version.txt"
  version <- fmap (fromMaybe "dev") $ lookupEnv "APPVEYOR_BUILD_VERSION"
  let fullVersion = version <> ".0"
  writeFile "version.txt" fullVersion

  echo "Adding permissions manifest to lux-launcher.exe"
  procs "C:\\Program Files (x86)\\Windows Kits\\8.1\\bin\\x64\\mt.exe" ["-manifest", "lux-launcher.exe.manifest", "-outputresource:lux-launcher.exe;#1"] mempty

  signFile "lux-launcher.exe"
  signFile "lux-node.exe"

  echo "Writing uninstaller.nsi"
  writeUninstallerNSIS fullVersion
  signUninstaller

  echo "Writing lux.nsi"
  writeInstallerNSIS fullVersion

  echo "Generating NSIS installer lux-win64-installer.exe"
  procs "C:\\Program Files (x86)\\NSIS\\makensis" ["lux.nsi"] mempty
  signFile ("lux-win64-" <> fullVersion <> "-installer.exe")
