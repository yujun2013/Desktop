const {ipcRenderer} = require('electron')
var screenShot = require('./screenshot/screenshot.render.js')
var download = require('./download/download.render.js')
window.RongDesktop = {
    ipcRenderer: ipcRenderer,
    screenShot: screenShot,
    download: download.download,
    cancelDownload: download.cancelDownload
}