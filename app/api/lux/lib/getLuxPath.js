import path from 'path';

export default (platform, env) => {
  switch (platform) {
    case 'darwin': {
      return path.join(env.HOME, 'Library', 'Application Support', "LUX");
    }
    case 'win32': {
      return path.join(env.APPDATA, "Lux");
    }
    case 'linux': {
      return path.join(env.HOME, ".lux");
    }
    default: {
      console.log('Unsupported platform');
      process.exit(1);
    }
  }
};
