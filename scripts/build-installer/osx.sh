#!/usr/bin/env bash
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
    $0 LUXTRE-VERSION LUXD-VERSION*

  Build a luxtre installer.
  
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

###
### Argument processing
###
fast_impure=
verbose=true
build_id=0
travis_pr=true
upload_s3=
test_install=

luxtre_version="$1"; arg2nz "luxtre version" $1; shift
luxd_version="$(printf '%s' "$1" | tr '/' '-')"; arg2nz "Luxcoin Daemon to build Luxcore with" $1; shift

case "$(uname -s)" in
        Darwin ) OS_NAME=darwin; os=osx;   luxd_zip=luxd-mac.zip;   key=macos-3.p12;;
        Linux )  OS_NAME=linux;  os=linux; luxd_zip=luxd-linux.zip; key=linux.p12;;
        * )     usage "Unsupported OS: $(uname -s)";;
esac

mkdir -p ~/.local/bin

export PATH=$HOME/.local/bin:$PATH
export LUXTRE_VERSION=${luxtre_version}.${build_id}
if [ -n "${NIX_SSL_CERT_FILE-}" ]; then export SSL_CERT_FILE=$NIX_SSL_CERT_FILE; fi

LUXCORE_DEAMON=luxd               # ex- luxtre-daemon

retry 5 curl -o ${LUXCORE_DEAMON}.zip \
        --location "https://github.com/216k155/luxtre/releases/download/v${luxd_version}/${luxd_zip}"
du -sh   ${LUXCORE_DEAMON}.zip
unzip -o ${LUXCORE_DEAMON}.zip
rm       ${LUXCORE_DEAMON}.zip

mv luxd installers/
rm -rf luxd-mac

cp -rf scripts/launcher/osx.sh installers/launcher.sh

test "$(find node_modules/ | wc -l)" -gt 100 -a -n "${fast_impure}" || npm install

test -d "release/darwin-x64/Luxcore-darwin-x64" -a -n "${fast_impure}" || {
        npm run package -- --icon installers/icons/256x256.png
        echo "Size of Electron app is $(du -sh release)"
}

test -n "$(which stack)"     -a -n "${fast_impure}" ||
        retry 5 bash -c "curl -L https://www.stackage.org/stack/${os}-x86_64 | \
                         tar xz --strip-components=1 -C ~/.local/bin"

cd installers
    retry 5 $(nix-build -j 2)/bin/make-installer
    mkdir -p dist
    if test -n "${test_install}"
    then echo "$0:  --test-install passed, will test the installer for installability";
         case ${os} in
                 osx )   sudo installer -dumplog -verbose -target / -pkg "dist/Luxcore-installer-${LUXTRE_VERSION}.pkg";;
                 linux ) echo "WARNING: installation testing not implemented on Linux" >&2;; esac; fi
cd ..

ls -la installers/dist

exit 0
