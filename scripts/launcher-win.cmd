@echo off
rem   launch LuxDaemon and LuxWallet

set LuxDaemon=luxd.exe
set LuxWallet=luxcore.exe

tasklist /FI "IMAGENAME eq %LuxDaemon%" 2>NUL | find /I /N "%LuxDaemon%">NUL
if "%ERRORLEVEL%"=="0" goto :launch_wallet

set conf=%APPDATA%\Lux\lux.conf

@findstr "daemon=" %conf% > nul
@if %errorlevel% neq 0 (echo.  echo daemon=1 >> %conf%)

@findstr "server=" %conf% > nul
@if %errorlevel% neq 0 (echo  echo server=1 >> %conf%)

@findstr "rpcuser=" %conf% > nul
@if %errorlevel% neq 0 (echo rpcuser=rpcuser >> %conf%)

set /a _rand=(%RANDOM%+%RANDOM%+955)*997
@findstr "rpcpassword=" %conf%> nul
@if %errorlevel% neq 0 (echo rpcpassword=%_rand%>> %conf%)

if exist %LuxDaemon% (
	powershell -Command "Start-Process %LuxDaemon% -WindowStyle Hidden"
)

:launch_wallet
start %LuxWallet%
