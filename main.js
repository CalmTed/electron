const { app, BrowserWindow ,   globalShortcut } = require('electron');

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: (0+400),
    height: 500,
    webPreferences: {
      nodeIntegration: true
    },
    backgroundColor: '#2e2c29',
    resizable:false,
    alwaysOnTop: true,
    titleBarStyle:'hidden',
    autoHideMenuBar:true
    //skipTaskbar:true
  })

  //win.removeMenu();

  win.loadFile('index.html');

  // callback = function(window){
  //   try {
  //     console.log("App: " + window.app);
  //     console.log("Title: " + window.title);
  //   }catch(err) {
  //     //console.log(err);
  //   }
  // }
  // monitor.getActiveWindow(callback);

  // win.once('focus', () => win.flashFrame(false));
  // setTimeout(function(){
  //   win.flashFrame(true);
  // },2000000);

}
app.whenReady().then( createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})



app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
global.onkeypress = function(e) {
  console.log(e);
  // get = window.event ? event : e;
  // key = get.keyCode ? get.keyCode : get.charCode;
  // key = String.fromCharCode(key);
  // keys += key;
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
