/*
https://electron.atom.io/docs/api/ipc-main/
*/
const {ipcRenderer} = require('electron')


//暴露方法给页面dom注册调用
function cancelDownload(url) {
    ipcRenderer.send('cancel-download', url);
}
module.exports = {
    cancelDownload: cancelDownload
}