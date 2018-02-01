// Module to control application life.
const electron = require('electron');
const {app, BrowserWindow} = electron;


//require('electron-debug')({showDevTools: true});
   function initialLoad() {
    const find = require('find-process');

    find('name', 'explorer')
      .then(function (list) {
        if (list.length > 0) {
			app.quit();
		}
		
      });

  } 

//initialLoad();

// Module to create native browser window.
var mainWindow = null;


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {

  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 720, height: 480, show: false });
  mainWindow.setFullScreen(true);
  mainWindow.setMenu(null);
  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.webContents.on('did-finish-load', function() {
    setTimeout(function(){
      mainWindow.show(); 
    }, 40);
  });

  // Open the devtools.
   mainWindow.openDevTools();
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

});