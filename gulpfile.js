'use strict';

var gulp = require('gulp');
var sequence = require('gulp-sequence');
var clean = require('gulp-clean');
var fs = require('fs-extra');
var argv = require('yargs')
      .option('platform', {
        alias: 'p',
        describe: 'choose a platform',
        choices: ['mac', 'darwin', 'windows','win', 'win32', 'win64', 'linux'],
        default: 'darwin'
      })
      .argv;
var path = require('path');
var packager = require('electron-packager');
var builder = require('electron-builder');

var packageJSON = require('./package.json');
var config = require('./config.js');
var CURRENT_ENVIRONMENT = 'development';
var finalAppPaths = [];
var childProcess = require('child_process');

gulp.task('cleanup:build', function() {
  var osInfo = getOSInfo();
  var arch = osInfo.arch;
  var platform = osInfo.platform;
  var src = './build/' + config.PACKAGE.PRODUCTNAME + '-' + platform + '-' + arch;
  src = './build';
  return gulp
    .src([src], {
      read: false
    })
    .pipe(clean());
});

gulp.task('package', function(done) {
  //var devDependencies = packageJSON.devDependencies;
  //var devDependenciesKeys = Object.keys(devDependencies);
  var ignoreFiles = [
    // 'build',
    'dist',
    'script',
    'notice.txt',
    'gulpfile.js',
    'builder.json',
    'gruntfile.js',
    '.npminstall',
    'index1.html',
    '配置说明.txt',
    'desktop_setup.iss',
    'screencapture.node_debug',
    'screencapture.node_pkg',
    '.vscode',
    '.gitignore',
    //'*.o',
    //'*.obj',
    'node_modules/.bin',
    '.gitignore',
    'platforms',
    'lib'
  ];

  //devDependenciesKeys.forEach(function(key) {
    //ignoreFiles.push('node_modules/' + key);
  //});
  var osInfo = getOSInfo();
  var arch = osInfo.arch;
  var platform = osInfo.platform;

  // We will keep all stuffs in dist/ instead of src/ for production
  var iconFolderPath = './res';
  var iconPath;
  var productName = config.PACKAGE.PRODUCTNAME;
  productName += '-' + platform + '-' + arch;
  if (platform === 'darwin') {
    iconPath = path.join(iconFolderPath, config.PACKAGE.MAC.APPICON);
    ignoreFiles.push('modules/screenshot/win/*');
    ignoreFiles.push('js/child.js');
    ignoreFiles.push('modules/screenshot/mac/screencaptureDebug.node');
  }
  else {
    iconPath = path.join(iconFolderPath, config.PACKAGE.WIN.APPICON);
    ignoreFiles.push('lib');
    ignoreFiles.push('modules/screenshot/mac/*');
    ignoreFiles.push('modules/screenshot/win/Qt5Core.dll');
    ignoreFiles.push('modules/screenshot/win/Qt5Gui.dll');
    ignoreFiles.push('modules/screenshot/win/Qt5Widgets.dll');
  }
  var ignorePath = ignoreFiles.join('|');
  var ignoreRegexp = new RegExp(ignorePath, 'ig');
  // var unpackRegexp = new RegExp(['screenshot.framework','RongIMLib.node'], 'ig');
  // var unpackRegexp = new RegExp(['*.node'], 'ig');

  packager({
    'dir': './',
    //'name': config.PACKAGE.PRODUCTNAME,
    'name': config.PACKAGE.APPNAME,
    'platform': platform,
    'asar': false,
    //'asar' : {
      //'unpack': 'modules/screenshot/*',
      //'unpackDir': 'modules/screenshot/'
    //},
    'arch': arch,
    'electronVersion': config.PACKAGE.RUNTIMEVERSION,
    'out': './build',
    'icon': iconPath,
    'appBundleId': config.APP_ID,   // OS X only
    'appVersion': config.PACKAGE.VERSION,
    //'build-version': config.MAC.CF_BUNDLE_VERSION,
    //'helper-bundle-id': config.MAC.HELPER_BUNDLE_ID, // OS X only
    'ignore': ignoreRegexp,
    'overwrite': true,
    'prune': true,
    'appCopyright': config.PACKAGE.COPYRIGHT,
    'osxSign': {
       'identity': 'Developer ID Application: Beijing Rong Cloud Network Technology CO., LTD (CQJSB93Y3D)'
    },
    //'extendInfo': './assets/info.plist'
    // 'all': true,
    
    'protocols': [{
        name: config.PROTOCAL,
        schemes: [config.PROTOCAL]
     }],
    'win32metadata': {
      'CompanyName': config.PACKAGE.AUTHOR,
      'FileDescription': config.PACKAGE.DESCRIPTION,
      'OriginalFilename': 'atom.exe',
      'ProductName': config.PACKAGE.PRODUCTNAME,
      'InternalName': config.PACKAGE.PRODUCTNAME
    }
    //'required': {
      //'darwin': darwinResources
    //}
  }, function(error, appPaths) {
    if (error) {
      console.log(error);
      process.exit(1);
    }
    else {
      // TODO
      // we should support to build all platforms at once later !
      // something like [ 'build/Kaku-darwin-x64' ]
      finalAppPaths = appPaths;
      done();
    }
  });
});

gulp.task('post-package', function(done) {
  var currentLicenseFile = path.join(__dirname, 'LICENSE');
  var promises = finalAppPaths.map(function(appPath) {
    var targetLicenseFile = path.join(appPath, 'LICENSE');
    var promise = new Promise(function(resolve, reject) {
      fs.copy(currentLicenseFile, targetLicenseFile, function(error) {
        if (error) {
          reject(error);
        }
        else {
          resolve();
        }
      });
    });
    return promise;
  });

  Promise.all(promises).then(function() {
    done();
  }).catch(function(error) {
    console.log(error)
    process.exit(1);
  });
});

gulp.task('build', function(callback) {
  var osInfo = getOSInfo();
  var tasks = [
    'cleanup:build',
    'package',
    'post-package'
  ];
  // if(osInfo.platform == 'darwin'){
  //   tasks.push('zip')
  // }
  sequence(
    tasks
  )(callback);
});

function getOSInfo(){
  var arch = process.arch || 'ia32';
  var platform = argv.platform || process.platform;
  platform = platform.toLowerCase();
  // platform = argv.p;
  switch (platform) {
    case 'mac':
    case 'darwin':
      platform = 'darwin';
      arch = 'x64';
      break;
    case 'freebsd':
    case 'linux':
      platform = 'linux';
      break;
    case 'linux32':
      platform = 'linux';
      arch = 'ia32';
      break;
    case 'linux64':
      platform = 'linux';
      arch = 'x64';
      break;
    case 'win':
    case 'win32':
    case 'windows':
      platform = 'win32';
      arch = 'ia32';
      break;
    case 'win64':
        platform = 'win32';
        arch = 'x64';
        break;
    default:
      console.log('We don\'t support your platform ' + platform);
      process.exit(1);
      break;
  }
  return {platform:platform, arch:arch};
}

//未用
function installerMac () {
  return new Promise((resolve, reject) => {
    console.log('begin make installerMac')
    var cmd = 'rm -rf ./dist/osx/SealTalk_Ent.dmg && electron-builder \"build/SealTalk_Ent-darwin-x64/SealTalk_Ent.app\" --platform=osx --out=\"dist/osx\" --config=builder.json --overwrite'

    childProcess.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject('installerMac failed' + error)
      } else {
        resolve()
      }
    })
  })
}

//未用
gulp.task('installerMac', function (cb) {
  var cmd = 'rm -rf ./dist/osx/SealTalk_Ent.dmg && electron-builder \"build/SealTalk_Ent-darwin-x64/SealTalk_Ent.app\" --platform=osx --out=\"dist/osx\" --config=builder.json --overwrite'

    childProcess.exec(cmd, (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

gulp.task('copyScreencapture', function (cb) {
  var osInfo = getOSInfo();
  var arch = osInfo.arch;
  var platform = osInfo.platform;
  var targetPlatform = path.join(__dirname, 'build', config.PACKAGE.PRODUCTNAME + '-' + platform + '-' + arch);
  targetPlatform = path.join(targetPlatform, config.PACKAGE.PRODUCTNAME + '.app', 'Contents', 'Resources', 'app', 'node_modules', 'screencapture.node');
  var currentPlatform = path.join(__dirname, 'node_modules', 'screencapture.node');
  fs.copy(currentPlatform, targetPlatform, function(error) {
    if (error) {
      console.log(error);
    }
    else {
      console.log('copy screencapture finished');
    }
  });
})

gulp.task('copyPlatforms', function (cb) {
  var osInfo = getOSInfo();
  var arch = osInfo.arch;
  var platform = osInfo.platform;
  var currentPlatform;
  var targetPlatform = path.join(__dirname, 'build', config.PACKAGE.PRODUCTNAME + '-' + platform + '-' + arch);
  if(platform == 'darwin'){
      currentPlatform = path.join(__dirname, 'modules', 'screenshot', 'mac', 'platforms');
      targetPlatform = path.join(targetPlatform, config.PACKAGE.PRODUCTNAME + '.app', 'Contents', 'MacOS', 'platforms');
  } else if(platform == 'win32'){
      currentPlatform = path.join(__dirname, 'modules', 'screenshot', 'win', 'platforms');
	    targetPlatform = path.join(targetPlatform, 'platforms');
  }
  fs.copy(currentPlatform, targetPlatform, function(error) {
    if (error) {
      console.log(error);
    }
    else {
      console.log('copy platforms finished');
    }
  });
})

gulp.task('copyLib', function (cb) {
  var osInfo = getOSInfo();
  var arch = osInfo.arch;
  var platform = osInfo.platform;
  var currentPlatform;
  var targetPlatform = path.join(__dirname, 'build', config.PACKAGE.PRODUCTNAME + '-' + platform + '-' + arch);
  if(platform == 'darwin'){
    currentPlatform = path.join(__dirname, 'modules', 'screenshot', 'mac', 'lib');
    targetPlatform = path.join(targetPlatform, config.PACKAGE.PRODUCTNAME + '.app', 'Contents', 'Resources', 'lib');
  } else if(platform == 'win32'){
    currentPlatform = path.join(__dirname, 'modules', 'screenshot', 'win', 'lib');
  }
  fs.copy(currentPlatform, targetPlatform, function(error) {
    if (error) {
      console.log(error);
    }
    else {
      console.log('copy lib finished');
    }
  });
})

