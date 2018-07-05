
# launch LuxDaemon and LuxWallet

LuxDaemon=luxd
LuxWallet=luxcore.app

if !(ps aux | grep ${LuxDaemon} | grep -v grep > /dev/null)
then
    if [ -f "${LuxDaemon}" ]
    then
    ./${LuxDaemon} -server -rpcuser=rpcuser -rpcpassword=rpcpwd -datadir=db &
    fi
fi

open -g ${LuxWallet}

