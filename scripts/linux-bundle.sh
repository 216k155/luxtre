#!/bin/bash
# DEPENDENCIES & REFERENCES:
#   0. 'git'
#   1. 'node.js 6.x'
#   2.  tr -d '\r' < old.sh > new.sh
#   3.  npm rebuild node-sass

DEFAULT_LUXTRE_BRANCH=master
DEFAULT_LUXDAEMON_VERSION=1.0.0

LUXTRE_BRANCH=${1:-${DEFAULT_LUXTRE_BRANCH}}

URL=https://github.com/216k155/luxtre.git

echo "Building Luxcore branch ${LUXTRE_BRANCH} from ${URL}"
git clone ${URL}

pushd luxtre
    git reset --hard origin/${LUXTRE_BRANCH}

    bash scripts/build-installer/linux.sh \
            "${LUXTRE_BRANCH}-$(git show-ref --hash HEAD)" \
popd