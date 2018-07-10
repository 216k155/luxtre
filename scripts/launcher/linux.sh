#!/bin/bash

LuxConfigPath=~/.lux
LuxConf=~/.lux/lux.conf
LuxDaemon=luxd

if [ ! -d ${LuxConfigPath} ]; then
    mkdir -p ${LuxConfigPath}
fi

if ! grep -qF "daemon=" ${LuxConf};then
   echo "daemon=1">>${LuxConf}
fi

if ! grep -qF "server=" ${LuxConf};then
   echo "server=1">>${LuxConf}
fi

if ! grep -qF "rpcuser=" ${LuxConf};then
   echo "rpcuser=rpcuser">>${LuxConf}
fi

if ! grep -qF "rpcpassword=" ${LuxConf};then
   echo "rpcpassword="$RANDOM$RANDOM>>${LuxConf}
fi

cd /opt/Luxtre

if !(ps aux | grep ${LuxDaemon} | grep -v grep > /dev/null)
then
    if [ -f "${LuxDaemon}" ]; then
    ./${LuxDaemon} &
    fi
fi

./Luxcore