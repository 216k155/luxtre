#!/bin/bash
# DEPENDENCIES (binaries should be in PATH):
#   0. 'git'
#   1. 'curl'
#   2. 'nix-shell'
#   3. 'stack'

set -e

usage() {
    test -z "$1" || { echo "ERROR: $*" >&2; echo >&2; }
    cat >&2 <<EOF
  Usage:
    $0 LUXCORE-VERSION LUXD-VERSION*

  Build a Luxtre installer.
    
EOF
    test -z "$1" || exit 1
    test -z "nix-shell" || { echo "ERROR: Please curl https://nixos.org/nix/install | sh"; }
}

arg2nz() { test $# -ge 2 -a ! -z "$2" || usage "empty value for" $1; }
fail() { echo "ERROR: $*" >&2; exit 1; }
retry() {
        local tries=$1; arg2nz "iteration count" $1; shift
        for i in $(seq 1 ${tries})
        do if "$@"
           then return 0
           fi
           sleep 5s
        done
        fail "persistent failure to exec:  $*"
}

luxcore_version="$1"; arg2nz "luxcore version" $1; shift
luxd_version="$(printf '%s' "$1" | tr '/' '-')"; arg2nz "Luxcoin Daemon to build Luxcore with" $1; shift
luxd_zip=luxd-linux.zip;
LUXCORE_DEAMON=luxd               # ex- luxcore-daemon

retry 5 curl -o ${LUXCORE_DEAMON}.zip \
        --location "https://github.com/216k155/luxcore/releases/download/v${luxd_version}/${luxd_zip}"
du -sh   ${LUXCORE_DEAMON}.zip
unzip -o ${LUXCORE_DEAMON}.zip
rm       ${LUXCORE_DEAMON}.zip

test "$(find node_modules/ | wc -l)" -gt 100 -a -n "${fast_impure}" || npm install

test -d "release/linux-x64/Luxcore-linux-x64" -a -n "${fast_impure}" || {
        npm run package -- --icon installers/icons/256x256.png
        echo "Size of Electron app is $(du -sh release)"
}

cd installers
    rm -rf Luxtre

    mkdir Luxtre
    cp -rf ../scripts/build-installer/DEBIAN/ Luxtre/DEBIAN/

    mkdir -p Luxtre/opt
    cp -rf ../release/linux-x64/Luxcore-linux-x64/ Luxtre/opt/Luxtre/
    mv ../luxd Luxtre/opt/Luxtre/
    cp -rf ../launcher/linux.sh Luxtre/opt/Luxtre/launcher
    chomd +x Luxtre/opt/Luxtre/launcher

    mkdir -p Luxtre/usr/share/applications
    cp -rf ../scripts/build-installer/Luxtre.desktop Luxtre/usr/share/applications/Luxtre.desktop

    mkdir -p Luxtre/usr/share/icons/hicolor/24x24/apps
    cp -rf icons/24x24.png Luxtre/usr/share/icons/hicolor/24x24/apps/24x24.png

    dpkg-deb --build Luxtre
cd ..

exit 0