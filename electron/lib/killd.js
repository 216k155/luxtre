const os = require('os'),
  exec = require('child_process').exec,
  electron = require('electron'),
  app = electron.app,
  osPlatform = os.platform();

// kill rogue luxd copies on start
module.exports = function (data, quit) {
  if (data == true) {
    let luxdGrep;

    switch (osPlatform) {
      case 'darwin':
        luxdGrep = "ps -p $(ps -A | grep -m1 luxd | awk '{print $1}') | grep -i luxd";
        break;
      case 'linux':
        luxdGrep = 'ps -p $(pidof luxd) | grep -i luxd';
        break;
      case 'win32':
        luxdGrep = 'tasklist';
        break;
    }
    exec(luxdGrep, function (error, stdout, stderr) {
      if (stdout.indexOf('luxd') > -1) {
        const pkillCmd = osPlatform === 'win32' ? 'taskkill /f /im luxd.exe' : 'pkill -15 luxd';
        //console.log('found another luxd process(es)');

        exec(pkillCmd, function (error, stdout, stderr) {
          //console.log(`${pkillCmd} is issued`);
          if (quit) { app.quit(); }
          if (error !== null) { console.error(`${pkillCmd} exec error: ${error}`); };
        });
      } else {
        if (quit) { app.quit(); }
      }

      if (error !== null) { console.error(`${luxdGrep} exec error: ${error}`); };
    });
  }
};
