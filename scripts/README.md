# Scripts

This folder provides scripts for build, installer and install dependenies in Windows/OSX/Linux

## Windows

###DEPENDENCIES:

   1. Node.js (version 6.x) (https://nodejs.org/en/download/releases/)
      Recommend to install v6.11.2
   2. Git     (https://github.com/git-for-windows/git/releases)
   3. Requesting administrative privileges to install 

###Run Script in commandline prompt
Simple Way

   windows-bundle.bat

For specific branch

   windows-bundle.bat develop

For build utilities

   windows-bundle.bat develop true


## OSX

   ./osx-bundle.sh

## Linux
###Run script in Terminal

   ./linux-bundle.sh

###Development Environment

   develop/devenv.sh

###Fix Errors

Error: /bin/bash^M: bad interpreter: No such file or directory

   sed -i -e 's/\r$//' linux-bundle.sh

Error: This usually happens because your environment has changed since running `npm install`.
Run `npm rebuild node-sass` to build the binding for your current environment. 

   npm update
   npm install
   nodejs node_modules/node-sass/scripts/install.js
   npm rebuild node-sass
