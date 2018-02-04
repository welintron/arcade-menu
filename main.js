// Module to control application life.
const electron = require('electron');
const {app, BrowserWindow} = electron;



global.sharedObject = {prop1: process.argv};


//require('electron-debug')({showDevTools: true});

// Module to create native browser window.
var mainWindow = null;

//utilizado para nao permitir o menu abrir se o explorer ja estiver aberto
//e o menu ter sido chamado pelo Hyperspin

const parametros = global.sharedObject.prop1;


//logger
/* var log4js = require('log4js');
log4js.configure({
  appenders: {
  out:{ type: 'console' },
  app:{ type: 'file', filename: 'L:/HD/Programas/electron-v1.7.4-win32-ia32/resources/appsite.log' }
  },
  categories: {
  default: { appenders: [ 'out', 'app' ], level: 'debug' }
  }
  });

var logger = log4js.getLogger('main.js'); 

logger.info(parametros); */

//utilizado para nao permitir o menu abrir se o explorer ja estiver aberto
//e o menu ter sido chamado pelo Hyperspin
if (parametros[1] === "hyperspin") {

  const find = require('find-process');

  find('name', 'Explorer.EXE')
    .then(function (list) {
      if (list.length === 0) {

        find('name', 'explorer')
        .then(function (list2) {
          if (list2.length > 0) {
            app.quit();
          } 
        });

      } else {
        app.quit(); 
      }
    });

  
} 


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
  mainWindow = new BrowserWindow({ width: 720, height: 480, show: false, icon: 'mklogo.png.png', });
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


