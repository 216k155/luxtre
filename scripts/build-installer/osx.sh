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
    $0 LUXTRE-VERSION LUXCOIN-BRANCH OPTIONS*

  Build a Luxcore installer.

  Options:
    --fast-impure             Fast, impure, incremental build
    --build-id BUILD-NO       Identifier of the build; defaults to '0'

    --travis-pr PR-ID         Travis pull request id we're building
    --nix-path NIX-PATH       NIX_PATH value

    --upload-s3               Upload the installer to S3
    --test-install            Test the installer for installability

    --verbose                 Verbose operation
    --quiet                   Disable verbose operation
    
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
luxcoin_branch="$(printf '%s' "$1" | tr '/' '-')"; arg2nz "Luxcoin Daemon to build Luxcore with" $1; shift

case "$(uname -s)" in
        Darwin ) OS_NAME=darwin; os=osx;   luxd_zip=luxd-mac.zip;   key=macos-3.p12;;
        Linux )  OS_NAME=linux;  os=linux; luxd_zip=luxd-linux.zip; key=linux.p12;;
        * )     usage "Unsupported OS: $(uname -s)";;
esac

set -u ## Undefined variable firewall enabled
while test $# -ge 1
do case "$1" in
           --fast-impure )                               fast_impure=true;;
           --build-id )       arg2nz "build identifier" $2;    build_id="$2"; shift;;
           --travis-pr )      arg2nz "Travis pull request id" $2;
                                                           travis_pr="$2"; shift;;
           --nix-path )       arg2nz "NIX_PATH value" $2;
                                                     export NIX_PATH="$2"; shift;;
           --upload-s3 )                                   upload_s3=t;;
           --test-install )                             test_install=t;;

           ###
           --verbose )        echo "$0: --verbose passed, enabling verbose operation"
                                                             verbose=t;;
           --quiet )          echo "$0: --quiet passed, disabling verbose operation"
                                                             verbose=;;
           --help )           usage;;
           "--"* )            usage "unknown option: '$1'";;
           * )                break;; esac
   shift; done

set -e
if test -n "${verbose}"
then set -x
fi

mkdir -p ~/.local/bin

export PATH=$HOME/.local/bin:$PATH
export LUXTRE_VERSION=${luxtre_version}.${build_id}
if [ -n "${NIX_SSL_CERT_FILE-}" ]; then export SSL_CERT_FILE=$NIX_SSL_CERT_FILE; fi

LUXCOIN_BUILD_UID="${OS_NAME}-${luxcoin_branch//\//-}"
LUXCORE_DEAMON=luxd               # ex- luxtre-daemon

retry 5 curl -o ${LUXCORE_DEAMON}.zip \
        --location "https://github.com/216k155/luxtre/releases/download/v${luxcoin_branch}/${luxd_zip}"
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
