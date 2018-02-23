# Running Lux acceptance tests


1. Make sure you have correct node/npm versions installed on your machine (node v6.x and npm v3.x)
2. Clone Lux repo to your machine (git@github.com:216k155/lux.git - use **master** branch)
3. Install npm dependencies from within Lux directory:
```
$ cd lux/
$ npm install
```
4. Link your backend build with the Lux frontend (assumed that you have build the backend previously):
```
$ cd lux/node_modules/
$ npm link lux-client-api
```
5. Launch the backend (lux-sl) in production/staging mode:
```
$ cd lux-sl/
$ ./scripts/launch/staging.sh
```
6. Run Lux frontend in hot-server mode:
```
$ cd lux/
$ npm run hot-server
```
7. Run Lux frontend tests in a separate Terminal window (leaving hot-server to run in the other):
```
$ cd lux/
$ npm run test
```

There is a total of 46 different acceptance tests.
Whole test suite takes around 5 minutes to finish.
Once tests are complete you will get a summary of passed/failed tests in the Terminal window.
Lux UI window will remain open - you are expected to close it manually before running tests again.
