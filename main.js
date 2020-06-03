const { app, BrowserWindow ,   globalShortcut } = require('electron');
var { PythonShell } =  require('python-shell');


// PythonShell.defaultOptions = { scriptPath: 'python/monitor' };
// PythonShell.run('python/kl.pyw', null ,  function  (err, results)  {
//   if (err) throw err;
//    console.log('hello.py finished.');
//    console.log('results', results);
// });


function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: (400),
    height: 600,
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
// console.log('starting python');
// var python = require('child_process').spawn('python', ['python/kl.pyw']);
//     python.stdout.on('data',function(data){
//         console.log("data: ",data.toString('utf8'));
//     });






app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
