/*
https://electron.atom.io/docs/api/ipc-main/
*/
module.exports = (function(){
const {ipcRenderer, clipboard, remote} = require('electron')
const app = remote.app

// const platform = {
//   Windows: /^win/i.test(process.platform),
//   OSX: /^darwin/i.test(process.platform),
//   Linux: /^linux/i.test(process.platform)
// }

// var nodeUrl;
// if(platform.OSX){
//     nodeUrl = app.getName() == 'Electron' ? './mac/screencaptureDebug' : './mac/screencapture'
// } else if(platform.Windows){
//     nodeUrl = './win/screencaptureDebug'
// }
// const screencapture = require(nodeUrl)
// 
// const screencapture = require('screencapture')


var sharedObj = remote.getGlobal('sharedObj');
var appCapture = null;
appCapture = sharedObj ? sharedObj.appCapture : screencapture;

const takeScreenshot = (callback) => {
    try{
        appCapture.screenCapture("", function(base64){
            var clipboardData = clipboard.readImage();
            callback(clipboardData.toDataURL());
        });
    } 
    catch(ex){
        // logger.error(ex.toString());
    }
}

//暴露方法给页面dom注册调用
return function(callback) {
    console.log("screenShot callback");
    takeScreenshot(callback);
};
})();