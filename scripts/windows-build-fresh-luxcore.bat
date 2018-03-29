rem DEPENDENCIES:
rem   1. Node.js (version 6.x) (https://nodejs.org/en/download/releases/)
         Recommend to install v6.11.2
rem   2. Git     (https://github.com/git-for-windows/git/releases)
rem   3. Requesting administrative privileges

@set DEFAULT_LUXCORE_BRANCH=master

set LUXCORE_BRANCH=%1
@if [%LUXCORE_BRANCH%]==[] (set LUXCORE_BRANCH=%DEFAULT_LUXCORE_BRANCH%)
set GITHUB_USER=%2
@if [%GITHUB_USER%]==[] (set GITHUB_USER=216k155)
set INSTALL_UTILS=%3
@if [%INSTALL_UTILS%]==[] (@echo WARNING: missing to install windows-build-tools(visual studio 2015 and python 2.7) for node-nyp
    goto :clone_luxcore)

call npm install -g node-gyp
@if %errorlevel% neq 0 (@echo FAILED: install windows-build-tools
    exit /b 1)

call npm install --global --production windows-build-tools
@if %errorlevel% neq 0 (@echo FAILED: install windows-build-tools
    exit /b 1)
	
:clone_luxcore
@set URL=https://github.com/%GITHUB_USER%/luxcore.git

move luxcore luxcore.old 2>nul

@echo Building Luxcore branch %LUXCORE_BRANCH% from %URL%
git clone %URL%
@if %errorlevel% neq 0 (@echo FAILED: git clone %URL%
	exit /b 1)

@pushd luxcore
    git reset --hard origin/%LUXCORE_BRANCH%
    @if %errorlevel% neq 0 (@echo FAILED: git reset --hard origin/%LUXCORE_BRANCH%
	exit /b 1)
    @for /f %%a in ('git show-ref --hash HEAD') do set version=%%a
    @call "C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\Tools\VsDevCmd.bat"

    @rem NOTE: we're setting the LUXCOIN_BRANCH to DEFAULT_LUXCORE_BRANCH:
    @rem       1. there's no obvious better choice
    @rem       2. this is intended as a workflow script sitting outside the repository, anyway
    call scripts\build-installer-win64 %GITHUB_USER%-%LUXCORE_BRANCH%-%version%
@popd