const {app, BrowserWindow, ipcMain, clipboard} = require('electron')

//333 screenshot module,mac only
const path = require('path')
const screencapture = require('screenshot/screencaptureDebug.node')
const appCapture = new screencapture.Main;

//444 screenshot function
const takeScreenshot = (callback) => {
    try{
        appCapture.screenCapture("", function(base64){
            if (win && win.webContents) {
                win.show()
                //向screenshot.js发送截图结果
                var clipboardData = clipboard.readImage();
                console.log(clipboardData.toDataURL());
                win.webContents.send('screenshot', clipboardData.toDataURL())
            }
        });
    } 
    catch(ex){
        // logger.error(ex.toString());
    }
}

module.exports = {
    takeScreenshot : takeScreenshot
};