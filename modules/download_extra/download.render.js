/*
https://electron.atom.io/docs/api/ipc-main/
*/
const {ipcRenderer, remote} = require('electron')
const request = require('request')
const fs = require('fs')
const path = require('path')
const url = require("url");
let downloadListener = {}
let app = remote.app
//暴露方法给页面dom注册调用

var downloadFile = (file_url , target_path, messageId, callback) => {
    // Save variable to know progress
    
    var parsed = url.parse(file_url);
    var filename = path.basename(parsed.pathname);
    target_path = target_path || path.join(app.getPath('downloads'), filename)
    // messageId = messageId || Math.floor(Math.random()*100)
    var received_bytes = 0;
    var total_bytes = 0;
    var req = request({
        method: 'GET',
        uri: file_url
    });
    downloadListener[messageId] = req || [];
    var out = fs.createWriteStream(target_path);
    req.pipe(out);

    var params = {
        state: '',
        messageId: '',
        receivedBytes: '',
        totalBytes: '',
        targetPath: ''
    };
    req.on('response', function ( data ) {
        // Change the total bytes value to get progress later.
        // console.log('response', data.statusCode)
        params = {
            state: 'preDownload',
            messageId: messageId,
            receivedBytes: 0,
            totalBytes: total_bytes,
            targetPath: target_path
        };
        received_bytes = 0;
        total_bytes = parseInt(data.headers['content-length' ]);
        callback(params);
    });

    req.on('data', function(chunk) {
        // console.log(chunk.length);
        received_bytes += chunk.length;
            params = {
            state: 'downloading',
            messageId: messageId,
            receivedBytes: received_bytes,
            totalBytes: total_bytes,
            targetPath: target_path
        };
        // mainWindow.webContents.send('onDownload', params)
        callback(params);
    });

    req.on('end', function() {
        params = {
            state: 'downloaded',
            messageId: messageId,
            receivedBytes: received_bytes,
            totalBytes: total_bytes,
            targetPath: target_path
        };
        callback(params);
    });
    
    req.on('error', function(error) {
        console.log('error', error.status);
        params = {
            state: 'downloadError',
            messageId: messageId,
            receivedBytes: received_bytes,
            totalBytes: total_bytes,
            targetPath: target_path,
            error: error
        };
        callback(params);
        // logger.error(error);
    });
};

function pause (id) {
    var curRequest = downloadListener[id]
    if(curRequest){
        curRequest.pause()
    }
}

function resume (id) {
    var curRequest = downloadListener[id]
    if(curRequest){
        curRequest.resume()
    }
}

function cancel (id) {
    var curRequest = downloadListener[id]
    if(curRequest){
        curRequest.abort()
    }
}

module.exports = {
    download: downloadFile,
    pause: pause,
    resume: resume,
    cancel: cancel
}
