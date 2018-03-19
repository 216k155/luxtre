rem DEPENDENCIES:
rem   1. Node.js ('npm' binary in PATH)
rem   2. 7zip    ('7z'  binary in PATH)
rem   3. Git     ('git' binary in PATH)

@set DEFAULT_LUXCORE_BRANCH=develop

set LUXCORE_BRANCH=%1
@if [%LUXCORE_BRANCH%]==[] (set LUXCORE_BRANCH=%DEFAULT_LUXCORE_BRANCH%)
set GITHUB_USER=%2
@if [%GITHUB_USER%]==[] (set GITHUB_USER=216k155)

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