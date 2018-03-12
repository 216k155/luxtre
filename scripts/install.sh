# Functions 
#   0. 'install git'
#   1. 'install npm'
#   2. 'install curl'
#   3. 'install libboost'
#   4. 'install libdb_cxx-4.8,so'
#   5. 'install nvm'
#   6. 'run auto-build-linux.sh'

echo "export PATH="$PATH:/usr/bin"" >> ~/.bashrc

if ! which git > /dev/null
then
	echo 'installing git ...'
        sudo apt-get update
        sudo apt-get install git
fi

if ! which npm > /dev/null
then 
	echo 'installing npm ...'
	sudo apt-get install npm
fi

if ! which curl > /dev/null
then 
	echo 'installing curl ...'
	sudo apt-get install curl
fi

if ! find /usr/lib -iname 'libboost*' > /dev/null
then 
	echo 'installing libboost-system1.58 ...'
	sudo apt-get update
	sudo apt-get install libboost-all-dev
	sudo apt-get install libdb5.3-dev
fi

if ! find /usr/local/lib -iname 'libdb_cxx*' > /dev/null
then
	echo 'installing libdb_cxx-4.8.so ...'
	wget http://download.oracle.com/berkeley-db/db-4.8.30.zip
    	unzip db-4.8.30.zip
    	cd db-4.8.30
    	cd build_unix/
    	../dist/configure --prefix=/usr/local --enable-cxx
    	make
    	make install
fi

if [ ! -d ~/.nvm ]; then
  echo 'installing nvm ...'
  sudo apt-get install build-essential libssl-dev
  sudo curl https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
fi

gnome-terminal -e "bash -c ./auto-build-linux.sh;bash"

kill -9 $PPID
exit

