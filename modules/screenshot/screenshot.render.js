/*
https://electron.atom.io/docs/api/ipc-main/
*/
module.exports = (function(){
const {ipcRenderer, clipboard, remote} = require('electron')
const app = remote.app

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