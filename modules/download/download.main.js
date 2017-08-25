const {ipcMain} = require('electron')
const url = require('url');
const path = require('path')
let downloadObject = {}

var handleImage = (item) => {
    item.once('done', (event, state) => {
        if (state === 'completed') {
            var fileName = item.getFilename();
            if(fileName.indexOf('.') == -1){
                var filePath = item.getSavePath();
                fs.rename(filePath, filePath + '.png', function(err) {
                    if (err) {
                        logger.error('rename file error:' + filePath);
                    }
                });
            }
            console.log(item.getMimeType(), item.getFilename());
        } else {
            console.log(`Download failed: ${state}`)
        }
    })
}

function download(mainWindow){
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        let _url = item.getURL();
        let _parseUrl = url.parse(_url);
        // let isImage = (item.getMimeType().indexOf('image/') > -1 || _parseUrl.hostname === 'rongcloud-image.ronghub.com');
        // if(isImage){
        //     handleImage(item);
        //     return;
        // } 
        let totalBytes = item.getTotalBytes();
        let callbackState;
        let params = {};
        downloadObject[_url] = item;
        item.on('updated', (event, state) => {
            mainWindow.setProgressBar(item.getReceivedBytes() / totalBytes);
            callbackState = state
            if(state == 'interrupted'){
                callbackState = 'paused'
            }
            params = {
                url : _url, 
                state : callbackState, 
                progress : item.getReceivedBytes() / item.getTotalBytes() * 100, 
                localPath : item.getSavePath()
            }
            mainWindow.webContents.send('download', params)
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed')
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused')
                } else {
                    // console.log(`Received bytes: ${item.getReceivedBytes()}`)
                }
            }
        })
        item.once('done', (event, state) => {
            if (!mainWindow.isDestroyed()) {
                mainWindow.setProgressBar(-1);
                // var downloadProgress = (state == 'completed' ? 100 : 0);
                // mainWindow.webContents.send('chDownloadState', _url, state, item.getSavePath())
                params = {
                    url : _url, 
                    state : state, 
                    progress : 100, 
                    localPath : item.getSavePath()
                }
                mainWindow.webContents.send('download', params)

                // sendToWebContents('chDownloadState', _url, state, item.getSavePath());
            }
            if (state === 'completed') {
                // console.log(`getSavePaths: ${item.getSavePath()}`);  //这里可以得到另存为的路径
                // shell.openItem(savePath);
                console.log(item.getMimeType(), item.getFilename());
            } else {
                console.log(`Download failed: ${state}`)
            }
        })
    })
}

ipcMain.on('cancel-download', (event, url) => {
    var downloadItem = downloadObject[url];
    if(downloadItem){
        downloadItem.cancel();
    }
})

module.exports = {
    addDownload : download
};