rem DEPENDENCIES:
rem   1. Node.js (version 6.x) (https://nodejs.org/en/download/releases/)
rem      Recommend to install v6.11.2
rem   2. Git     (https://github.com/git-for-windows/git/releases)
rem   3. Requesting administrative privileges

rem Arguments
rem   1. LUXTRE_BRANCH (ex: master)
rem   2. INSTALL_UTILS (ex: true)

rem Commandline Template
rem   ex1. windows-bundle.bat
rem   ex2. windows-bundle.bat develop
rem   ex2. windows-bundle.bat develop true

@set DEFAULT_LUXTRE_BRANCH=master

set LUXTRE_BRANCH=%1
@if [%LUXTRE_BRANCH%]==[] (set LUXTRE_BRANCH=%DEFAULT_LUXTRE_BRANCH%)

set INSTALL_UTILS=%2
@if [%INSTALL_UTILS%]==[] (@echo WARNING: missing to install visual studio 2015 and python 2.7
    goto :clone_luxtre)

call npm install -g node-gyp
@if %errorlevel% neq 0 (@echo FAILED: install windows-build-tools
    exit /b 1)

call npm install --global --production windows-build-tools
@if %errorlevel% neq 0 (@echo FAILED: install windows-build-tools
    exit /b 1)
	
:clone_luxtre
@set URL=https://github.com/216k155/luxtre.git

move luxtre luxtre.old 2>nul

@echo Building luxtre branch %LUXTRE_BRANCH% from %URL%
git clone %URL%
@if %errorlevel% neq 0 (@echo FAILED: git clone %URL%
	exit /b 1)

@pushd luxtre
    git reset --hard origin/%LUXTRE_BRANCH%
    @if %errorlevel% neq 0 (@echo FAILED: git reset --hard origin/%LUXTRE_BRANCH%
	exit /b 1)
    @for /f %%a in ('git show-ref --hash HEAD') do set version=%%a
    @call "C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\Tools\VsDevCmd.bat"

    @rem NOTE: we're setting the LUXCOIN_BRANCH to DEFAULT_LUXTRE_BRANCH:
    @rem       1. there's no obvious better choice
    @rem       2. this is intended as a workflow script sitting outside the repository, anyway
    call scripts\build-installer-win64 %LUXTRE_BRANCH%-%version%
@popd