
# launch LuxDaemon and LuxWallet

LuxDaemon=luxd
LuxWallet=luxtre.app

if !(ps aux | grep ${LuxDaemon} | grep -v grep > /dev/null)
then
    if [ -f "${LuxDaemon}" ]
    then
    ./${LuxDaemon} &
    fi
fi

open -g ${LuxWallet}

