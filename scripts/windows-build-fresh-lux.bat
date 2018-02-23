rem DEPENDENCIES:
rem   1. Node.js ('npm' binary in PATH)
rem   2. 7zip    ('7z'  binary in PATH)
rem   3. Git     ('git' binary in PATH)

@set DEFAULT_LUX_BRANCH=lux-sl-0.4

set LUX_BRANCH=%1
@if [%LUX_BRANCH%]==[] (set LUX_BRANCH=%DEFAULT_LUX_BRANCH%)
set GITHUB_USER=%2
@if [%GITHUB_USER%]==[] (set GITHUB_USER=216k155)

@set URL=https://github.com/%GITHUB_USER%/lux.git

move lux lux.old 2>nul

@echo Building Lux branch %LUX_BRANCH% from %URL%
git clone %URL%
@if %errorlevel% neq 0 (@echo FAILED: git clone %URL%
	exit /b 1)

@pushd lux
    git reset --hard origin/%LUX_BRANCH%
    @if %errorlevel% neq 0 (@echo FAILED: git reset --hard origin/%LUX_BRANCH%
	exit /b 1)
    @for /f %%a in ('git show-ref --hash HEAD') do set version=%%a
    @call "C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\Tools\VsDevCmd.bat"

    @rem NOTE: we're setting the LUX_BRANCH to DEFAULT_LUX_BRANCH:
    @rem       1. there's no obvious better choice
    @rem       2. this is intended as a workflow script sitting outside the repository, anyway
    call scripts\build-installer-win64 %GITHUB_USER%-%LUX_BRANCH%-%version% %DEFAULT_LUX_BRANCH%
@popd
