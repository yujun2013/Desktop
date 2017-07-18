const {app, BrowserWindow, ipcMain, clipboard} = require('electron')
const path = require('path')

const download = require('./modules/download/download.main.js')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const platform = {
  Windows: /^win/i.test(process.platform),
  OSX: /^darwin/i.test(process.platform),
  Linux: /^linux/i.test(process.platform)
}

var nodeUrl;
if(platform.OSX){
    nodeUrl = app.getName() == 'Electron' ? './modules/screenshot/mac/screencaptureDebug' : './modules/screenshot/mac/screencapture'
} else if(platform.Windows){
    nodeUrl = './modules/screenshot/win/screencapture'
}
const screencapture = require(nodeUrl)
const appCapture = new screencapture.Main;
global.sharedObj = {appCapture: appCapture};

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800, 
    height: 600,
    'webPreferences': {
          // nodeIntegration: false,
          preload: path.join(__dirname, 'modules', 'preload.js')
          // preload: path.join(__dirname, 'modules','screenshot', 'screenshot.render.js')
      }
  })

  // and load the index.html of the app.
  // win.loadURL(`file://${__dirname}/requirejs-in-node.html`)
  win.loadURL(`file://${__dirname}/download.html`)

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
  //create window
  createWindow();
  download.addDownload(win);
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.