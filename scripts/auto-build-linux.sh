# References:
#   0. 'git'
#   1. 'node.js 6.x'
#   2.  tr -d '\r' < old.sh > new.sh
#   3.  npm rebuild node-sass

GITHUB_USER=KaceyBolman
CLONE_DIR=TestLuxCoin
URL=https://github.com/${GITHUB_USER}/TestLuxCoin.git

#open lux core rpc-daemon
exec ./run-core-linux.sh &

#download from git
echo "Building Luxcore from ${URL}"
git clone ${URL}
cd ${CLONE_DIR}

#install node-modules
npm install

#run wallet-gui
npm run dev

exec /bin/bash
