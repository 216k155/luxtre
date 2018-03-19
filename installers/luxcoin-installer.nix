{ mkDerivation, base, bytestring, directory, filepath, Glob
, megaparsec, nsis, optparse-applicative, split, stdenv
, system-filepath, temporary, text, turtle, universum, yaml
}:
mkDerivation {
  pname = "luxcoin-installer";
  version = "0.1.0.0";
  src = ./.;
  isLibrary = false;
  isExecutable = true;
  executableHaskellDepends = [
    base bytestring directory filepath Glob megaparsec nsis
    optparse-applicative split system-filepath temporary text turtle
    universum yaml
  ];
  description = "Luxcoin Installer";
  license = stdenv.lib.licenses.mit;
}
