{ mkDerivation, base, directory, filepath, Glob, megaparsec, nsis
, stdenv, temporary, text, turtle
}:
mkDerivation {
  pname = "lux-installer";
  version = "0.1.0.0";
  src = ./.;
  isLibrary = false;
  isExecutable = true;
  executableHaskellDepends = [
    base directory filepath Glob megaparsec nsis temporary text turtle
  ];
  description = "Lux Installer";
  license = stdenv.lib.licenses.mit;
}
