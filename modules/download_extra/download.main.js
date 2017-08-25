const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const url = require("url")
var mainWindow;

var init = (window) => {
    mainWindow = window;
}
ipcMain.on('show-save-dialog', (event, file_url , target_path, messageId) => {
    var parsed = url.parse(file_url);
    var filename = path.basename(parsed.pathname);
    target_path = target_path || path.join(app.getPath('downloads'), filename)

    dialog.showSaveDialog(mainWindow, {
        title: filename,
        defaultPath: target_path
      }, function(result){
        mainWindow.webContents.send('beginDownload', file_url , result, messageId)
    });
})

module.exports = {
    init : init
};