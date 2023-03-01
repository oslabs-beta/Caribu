import { app, BrowserWindow, ipcMain } from 'electron';
const { spawn, execFile } = require('child_process')
// const fetch = require('node-fetch');


const path = require('path')
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 1000,
    width: 1200,
    icon: __dirname + './././assets/circle_logo_thicker.svg',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true
    },
  });

  // const expressServer = execFile('node', ['/Users/morry/git/Caribu/server/server.js'], {
  //   cwd: path.join(__dirname, '..', 'server'),
  //   env: {
  //     ...process.env,
  //     NODE_PATH: '/Users/morry/git/Caribu/node_modules'
  //   }
  // })
  

  //this server's node modules are in /Users/morry/git/Caribu/
  // const expressServer = execFile('node', ['/Users/morry/git/Caribu/server/server.js'], {
  //   cwd: path.join(__dirname, '..', 'server'),
  // })

  // expressServer.on('message', (msg) => {
  //   // Handle messages received from the Express server
  //   mainWindow.webContents.send('express-response', msg)
  // })


  // ipcMain.handle('fetch-request', async (event, args) => {
  //   const { url, method, body } = args;
  //   const response = await fetch(`http://localhost:6969${url}`, {
  //     method,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(body),
  //   });
  //   return response.json();
  // });
  
  // // Handle messages received from the renderer process
  // ipcMain.on('express-request', (event, arg) => {
  //   // Send the relevant message to the Express server
  //   expressServer.send(arg)
  // })

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
