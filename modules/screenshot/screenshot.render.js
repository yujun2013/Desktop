/*
https://electron.atom.io/docs/api/ipc-main/
*/
module.exports = (function(){
const {ipcRenderer, clipboard, remote} = require('electron')
const app = remote.app

var sharedObj = remote.getGlobal('sharedObj');
var appCapture = null;
// console.log('sharedObj', sharedObj, sharedObj.appCapture);
appCapture = sharedObj ? sharedObj.appCapture : null;

const takeScreenshot = (callback, canelCallback) => {
    try{
        appCapture.screenCapture("", function(base64){
            if(base64 === 'image'){
                var clipboardData = clipboard.readImage();
                callback(clipboardData.toDataURL());
            } else {
                canelCallback();
            }
        });
    } 
    catch(ex){
        // logger.error(ex.toString());
    }
}

//暴露方法给页面dom注册调用
return function(callback, canelCallback) {
    takeScreenshot(callback, canelCallback);
};
})();