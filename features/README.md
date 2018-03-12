# Running Luxcore acceptance tests


1. Make sure you have correct node/npm versions installed on your machine (node v6.x and npm v3.x)
2. Clone Luxcore repo to your machine (git@github.com:Luxcore/luxcore.git - use **master** branch)
3. Install npm dependencies from within Luxcore directory:
```
$ cd luxcore/
$ npm install
```
4. Link your backend build with the Luxcore frontend (assumed that you have build the backend previously):
```
$ cd luxcore/node_modules/
$ npm link luxcore-client-api
```
5. Launch the backend (luxcoin-sl) in production/staging mode:
```
$ cd luxcoin-sl/
$ ./scripts/launch/staging.sh
```
6. Run Luxcore frontend in hot-server mode:
```
$ cd luxcore/
$ npm run hot-server
```
7. Run Luxcore frontend tests in a separate Terminal window (leaving hot-server to run in the other):
```
$ cd luxcore/
$ npm run test
```

There is a total of 46 different acceptance tests.
Whole test suite takes around 5 minutes to finish.
Once tests are complete you will get a summary of passed/failed tests in the Terminal window.
Luxcore UI window will remain open - you are expected to close it manually before running tests again.
