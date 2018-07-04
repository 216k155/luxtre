rem DEPENDENCIES:
rem   1. Node.js ('npm' binary in PATH)
rem
rem   installer dev mode:  set SKIP_TO_FRONTEND/SKIP_TO_INSTALLER
set MIN_LUXCOIN_BYTES=50000000
set LIBRESSL_VERSION=2.5.3
set CURL_VERSION=7.54.0
set LUXCOIN_BRANCH_DEFAULT=1.0.0
set LUXTRE_VERSION_DEFAULT=local-dev-build-%LUXCOIN_BRANCH_DEFAULT%

set LUXTRE_VERSION=%1
@if [%LUXTRE_VERSION%]==[] (@echo WARNING: LUXTRE_VERSION [argument #1] was not provided, defaulting to %LUXTRE_VERSION_DEFAULT%
    set LUXTRE_VERSION=%LUXTRE_VERSION_DEFAULT%);
set LUXCOIN_BRANCH=%2
@if [%LUXCOIN_BRANCH%]==[]   (@echo WARNING: LUXCOIN_BRANCH [argument #2] was not provided, defaulting to %LUXCOIN_BRANCH_DEFAULT%
    set LUXCOIN_BRANCH=%LUXCOIN_BRANCH_DEFAULT%);

set CURL_URL=https://bintray.com/artifact/download/vszakats/generic/curl-%CURL_VERSION%-win64-mingw.7z
set CURL_BIN=curl-%CURL_VERSION%-win64-mingw\bin
set LUXD_URL=https://github.com/216k155/luxtre/releases/download/v%LUXCOIN_BRANCH%/luxd-wins.zip
set LIBRESSL_URL=https://ftp.openbsd.org/pub/OpenBSD/LibreSSL/libressl-%LIBRESSL_VERSION%-windows.zip

@echo Building luxtre version:  %LUXTRE_VERSION%
@echo ..with Luxcoin branch:      %LUXCOIN_BRANCH%
@echo ..with LibreSSL version:    %LIBRESSL_VERSION%
@echo .

@if not [%SKIP_TO_INSTALLER%]==[] (@echo WARNING: SKIP_TO_INSTALLER set, skipping to frontend packaging       
    pushd installers & goto :build_installer)
@if not [%SKIP_TO_FRONTEND%]==[]   (@echo WARNING: SKIP_TO_FRONTEND set, skipping directly to installer rebuild
    pushd installers & goto :build_frontend)

@echo Extracting curl
7z\7z x 7z\curl.7z -y
@if %errorlevel% neq 0 (@echo FAILED: couldn't extract curl
	popd & exit /b 1)

@echo Obtaining Luxcoin v%LUXCOIN_BRANCH%
del /f luxd-wins.zip 2>nul
.\curl --location %LUXD_URL% -o luxd-wins.zip
@if %errorlevel% neq 0 (@echo FAILED: couldn't obtain the Luxcoin v%LUXCOIN_BRANCH%
popd & exit /b 1)
7z\7z x luxd-wins.zip -y
@if %errorlevel% neq 0 (@echo FAILED: 7z x luxd-wins.zip -y
popd & exit /b 1)
move luxd.exe     installers\
rmdir /s/q luxd-wins 2>nul
del luxd-wins.zip

@echo Launcher.cmd
copy /y scripts\launcher-win.cmd installers\launcher.cmd

@echo Installing NPM
call npm install
@if %errorlevel% neq 0 (@echo FAILED: npm install
    exit /b 1)

:build_frontend
@echo Packaging frontend
call npm run package -- --icon installers/icons/64x64
@if %errorlevel% neq 0 (@echo FAILED: Failed to package the frontend
	exit /b 1)

pushd installers
    del /f LibreSSL.zip 2>nul
    @echo Obtaining LibreSSL %LIBRESSL_VERSION%
    ..\curl %LIBRESSL_URL% -o LibreSSL.zip
    @if %errorlevel% neq 0 (@echo FAILED: LibreSSL couldn't be obtained
	popd & exit /b 1)
    ..\7z\7z x LibreSSL.zip
    @if %errorlevel% neq 0 (@echo FAILED: LibreSSL couldn't be extracted from downloaded archive
	popd & exit /b 1)
    del LibreSSL.zip
    rmdir /s/q libressl
    move libressl-%LIBRESSL_VERSION%-windows libressl

    @echo Installing stack
    ..\curl --location http://www.stackage.org/stack/windows-x86_64 -o stack.zip
    @if %errorlevel% neq 0 (@echo FAILED: stack couldn't be obtained
	popd & exit /b 1)
    del /f stack.exe 2>nul
    ..\7z\7z x stack.zip stack.exe
    @if %errorlevel% neq 0 (@echo FAILED: couldn't extract stack from the distribution package
	exit /b 1)
    del stack.zip

    @echo Building the installer
    stack setup --no-reinstall
    @if %errorlevel% neq 0 (@echo FAILED: stack setup --no-reinstall
	exit /b 1)

:build_installer
    call ..\scripts\appveyor-retry call stack --no-terminal build -j 2 --exec make-installer
    @if %errorlevel% equ 0 goto :built

    @echo FATAL: persistent failure while building installer with:  call stack --no-terminal build -j 2 --exec make-installer
    exit /b 1
:built
@echo SUCCESS: call stack --no-terminal build -j 2 --exec make-installer
popd

@dir /b/s installers\luxtre*
