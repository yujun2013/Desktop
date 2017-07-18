/*
https://electron.atom.io/docs/api/ipc-main/
*/
const {ipcRenderer} = require('electron')


//暴露方法给页面dom注册调用
function cancelDownload(url) {
    ipcRenderer.send('cancel-download', url);
}

function download(callback) {
    window.RongDesktop.downloadCallback = callback;
}
module.exports = {
    download: download,
    cancelDownload: cancelDownload
}

ipcRenderer.on('download', (event, params) => {
    console.log('download callback');
    window.RongDesktop.downloadCallback(params);
});