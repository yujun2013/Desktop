const {ipcRenderer} = require('electron')
var screenShot = require('./screenshot/screenshot.render.js')
var download = require('./download/download.render.js')
window.RongDesktop = {
    screenShot: screenShot,
    download: download.download,
    cancelDownload: download.cancelDownload
}

window.Electron = {
    ipcRenderer: ipcRenderer
}