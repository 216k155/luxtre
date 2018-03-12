#!/bin/bash
# Tested on Ubuntu 16.0.4

export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/local/lib"

export LUX_NAME="./lux-qt"
export LUX_ZIP="lux-qt-linux.zip"
export LUX_ZIP_PATH="https://github.com/216k155/lux/releases/download/v4.2.0/lux-qt-linux.zip"

if [ ! -f "$LUX_NAME" ]; then
    if [ ! -f "$LUX_ZIP" ]; then
    	wget $LUX_ZIP_PATH
    fi
    unzip lux-qt-linux.zip
fi

chmod +777 $LUX_NAME 
$LUX_NAME -server -rpcuser=rpcuser -rpcpassword=rpcpwd

exit

