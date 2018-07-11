# DEPENDENCIES (binaries should be in PATH):
#   0. 'git'
#   1. 'curl'
#   2. 'nix-shell'
#   3. 'stack'

DEFAULT_LUXTRE_BRANCH=master
DEFAULT_LUXD_VERSION=1.0.0

LUXTRE_BRANCH=${1:-${DEFAULT_LUXTRE_BRANCH}}
GITHUB_USER=${2:-216k155}
LUXD_VERSION=${3:-${DEFAULT_LUXD_VERSION}}
shift 2

URL=https://github.com/${GITHUB_USER}/luxtre.git

test ! -e luxtre.old ||
        rm -rf luxtre.old
mv luxtre luxtre.old 2>/dev/null

set -e -u

test -n "$(type -P nix-shell)" || {
        cat <<EOF
WARNING: 'nix-shell' is absent from PATH

Installation can be performed by following instructions at:

  https://nixos.org/nix/download.html

..or, if you're willing to skip straight to action:

  curl https://nixos.org/nix/install | sh

..are you willing to perform the above command?

EOF
        echo -n "Confirm: Y / n? "
        read ans
        test "${ans}" = "Y" -o "${ans}" = "y" -o -z "${ans}" || {
                echo "FATAL: 'nix-shell' unavailable and user declined to proceed with installation." >&2
                exit 1
        }
        echo "INFO:  proceeding with Nix installation, hang on tight."
        echo
        curl https://nixos.org/nix/install | sh
        echo '. ~/.nix-profile/lux/profile.d/nix.sh' >> ~/.profile
        . ~/.profile
}

echo "Building Luxcore branch ${LUXTRE_BRANCH} from ${URL}"
git clone ${URL}

pushd luxtre
    git reset --hard origin/${LUXTRE_BRANCH}

    bash scripts/build-installer/osx.sh \
        "${GITHUB_USER}-${LUXTRE_BRANCH}-$(git show-ref --hash HEAD)" \
        "${LUXD_VERSION}" \
        "$@"
popd
