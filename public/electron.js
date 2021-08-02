const path = require("path");

const {app, BrowserWindow, ipcMain} = require("electron");
const isDev = require("electron-is-dev");

const Store = require('electron-store');

const {ipcConstants} = require(path.join(app.getAppPath(), './src/utils/IpcConstants.js'));

const store = new Store();

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
    const devTools = require("electron-devtools-installer");
    installExtension = devTools.default;
    REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
    app.quit();
}

let mainWindow;
let secondWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );

    // Open the DevTools.
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  makeSecondWindow();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    if (isDev) {
        installExtension(REACT_DEVELOPER_TOOLS)
            .then(name => console.log(`Added Extension:  ${name}`))
            .catch(error => console.log(`An error occurred: , ${error}`));
    }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on(ipcConstants.TO_MAIN_WINDOW, (event, args) => {
    // console.log('message type is ' + args['messageType']);
    mainWindow.webContents.send(args['messageType'], args);
});

ipcMain.on(ipcConstants.TO_SECOND_WINDOW, (event, args) => {
    // console.log('message type is ' + args['messageType']);
    secondWindow.webContents.send(args['messageType'], args);
});

ipcMain.handle(ipcConstants.GET_STORE_VAL, (event, key) => {
    // console.log('in getStoreValue, key is ' + key);
    return store.get(key);
});

ipcMain.handle(ipcConstants.SET_STORE_VAL, (event, key, value) => {
    store.set(key, value);
});

const makeSecondWindow = () => {
  secondWindow = new BrowserWindow({
        parent: mainWindow,
        width: 400,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            // enableRemoteModule: true
        }
    });

  secondWindow.on('closed', () => {
    secondWindow = null
    });
  secondWindow.loadURL(
        isDev
            ? "http://localhost:3000/Second"
            : `file://${path.join(__dirname, "../build/index.html#Second")}`
    );

    // Open the DevTools.
    if (isDev) {
      secondWindow.webContents.openDevTools();
    }
}

ipcMain.on(ipcConstants.OPEN_SECOND_WINDOW, (event) => {
  console.log('Got models:open message');
  if (secondWindow == null) {
    console.log('model window is null');
    makeSecondWindow();
  } else {
    // Show the existing window
    // console.log("window is not null");
    secondWindow.focus();
  }
});