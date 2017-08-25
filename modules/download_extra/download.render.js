/*
https://electron.atom.io/docs/api/ipc-main/
*/
const {ipcRenderer, remote, dialog} = require('electron')
const request = require('request')
const fs = require('fs')
const path = require('path')
const url = require("url");
let downloadListener = {}
let app = remote.app
//暴露方法给页面dom注册调用

var showSaveDialog = (file_url , target_path, messageId, callback) => {
    ipcRenderer.send('show-save-dialog', file_url , target_path, messageId)
    window.RongDesktop.downloadCallback[messageId] = callback;
}

ipcRenderer.on('beginDownload', (event, file_url , target_path, messageId) => {
    var callback = window.RongDesktop.downloadCallback[messageId];
    downloadFile(file_url , target_path, messageId, callback)
    delete window.RongDesktop.downloadCallback[messageId]
})

var downloadFile = (file_url , target_path, messageId, callback) => {
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
    download: showSaveDialog,
    pause: pause,
    resume: resume,
    cancel: cancel
}
