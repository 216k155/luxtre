#!/bin/bash
#########################################################
# This script is to install dependencies for development 
#   0. 'install git'
#   1. 'install npm'
#   2. 'install curl'
#   3. 'install libboost, libqrencode3, libzmq3-dev'
#   4. 'install libdb_cxx-4.8,so'
#   5. 'install nvm'
# Tested in ubuntu 16.04
#########################################################
#export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/local/lib"
echo "export PATH="$PATH:/usr/bin"" >> ~/.bashrc
sudo apt-get update
if ! [ -x "$(command -v git)" ]; then
  	echo 'installing git ...'
        sudo apt-get install git
fi

if ! [ -x "$(command -v npm)" ]; then 
	echo 'installing npm ...'./
	sudo apt-get install npm
fi

if ! [ -x "$(command -v curl)" ]; then 
	echo 'installing curl ...'
	sudo apt-get install curl
fi

echo 'installing libboost-all-dev, libqrencode3, libzmq3-dev ...'
sudo apt-get install libboost-all-dev
sudo apt-get install libqrencode3
sudo apt-get install libzmq3-dev

if (($(find /usr/lib -iname 'libdb_cxx*'| wc -c) == 0)); then
	echo 'installing libdb4.8 ...'
	sudo add-apt-repository ppa:bitcoin/bitcoin
	sudo apt-get update
	sudo apt-get install libdb4.8-dev libdb4.8++-dev
fi

if [ ! -d ~/.nvm ]; then
  echo 'installing nvm ...'
  sudo apt-get install build-essential libssl-dev
  sudo curl https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
fi
