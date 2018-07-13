
# launch LuxDaemon and LuxWallet

LuxDaemon=luxd
LuxWallet=luxtre.app

#!/bin/bash

LuxConf=~/Library/Application\ Support/LUX/lux.conf
LuxDaemon=luxd

mkdir ~/Library/Application\ Support/LUX

if ! grep daemon= ~/Library/Application\ Support/LUX/lux.conf; then echo daemon=1>>~/Library/Application\ Support/LUX/lux.conf; fi
if ! grep server= ~/Library/Application\ Support/LUX/lux.conf; then echo server=1>>~/Library/Application\ Support/LUX/lux.conf; fi
if ! grep rpcuser= ~/Library/Application\ Support/LUX/lux.conf; then echo rpcuser=rpcuser>>~/Library/Application\ Support/LUX/lux.conf; fi
if ! grep rpcpassword= ~/Library/Application\ Support/LUX/lux.conf; then echo rpcpassword=$RANDOM$RANDOM>>~/Library/Application\ Support/LUX/lux.conf; fi

if !(ps aux | grep ${LuxDaemon} | grep -v grep > /dev/null)
then
    if [ -f "${LuxDaemon}" ]
    then
    ./${LuxDaemon} &
    fi
fi

open -g ${LuxWallet}

