const { app, BrowserWindow } = require('electron');

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


  // win.once('focus', () => win.flashFrame(false));
  // setTimeout(function(){
  //   win.flashFrame(true);
  // },2000000);
}
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
