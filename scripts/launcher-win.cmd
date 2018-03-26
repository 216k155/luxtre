@echo off
rem   launch LuxDaemon and LuxWallet

set LuxDaemon=luxd.exe
set LuxWallet=luxcore.exe

tasklist /FI "IMAGENAME eq %LuxDaemon%" 2>NUL | find /I /N "%LuxDaemon%">NUL
if "%ERRORLEVEL%"=="0" goto :launch_wallet

if exist %LuxDaemon% (
	powershell -Command "Start-Process %LuxDaemon% -ArgumentList '-server -rpcuser=rpcuser -rpcpassword=rpcpwd' -WindowStyle Hidden"
)

:launch_wallet
start %LuxWallet%
