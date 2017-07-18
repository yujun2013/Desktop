const {ipcRenderer} = require('electron')
var screenShot = require('./screenshot/screenshot.render.js')
var download = require('./download/download.render.js')
window.Electron = {
    ipcRenderer: ipcRenderer,
    screenShot: screenShot,
    cancelDownload: download.cancelDownload
}