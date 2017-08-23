/*
https://electron.atom.io/docs/api/ipc-main/
*/
const {ipcRenderer, remote} = require('electron')
const BrowserWindow = remote.BrowserWindow
let mainWindow = BrowserWindow.getFocusedWindow();
let shake = null

function shakeWindow(interval, time) {
    window.RongDesktop.downloadCallback = callback;
}

function clearShake() {
    if(shake){
        clearInterval(shake)
    }
    shake = null
}

function execShake (flag) {
    var _position;
    if (mainWindow) {
        _position = mainWindow.getPosition()
        if(flag){
            mainWindow.setPosition(_position[0] + 10, _position[1])
        } else {
            mainWindow.setPosition(_position[0] - 10, _position[1])
        }
    }
}

function shakeWindow (_interval, _time) {
    if (mainWindow) {
        var flag = false;
        clearShake();
        if(typeof _interval != 'number'){
            _interval = 25;
        }
        if(typeof _time != 'number'){
            _time = 1000;
        }
        shake = setInterval(function(){
            flag = !flag;
            execShake(flag);
        },_interval);
        setTimeout(function(){
            clearShake()
        },_time)
    }
}

module.exports = {
    shakeWindow: shakeWindow
}
