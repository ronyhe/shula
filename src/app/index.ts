import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { createMenu } from './menu'

declare const MAIN_WINDOW_WEBPACK_ENTRY: never

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    app.quit()
}

const isMac: boolean = process.platform === 'darwin'

const size = {
    width: 498,
    height: 317
}

const createWindow = (): void => {
    // Create the browser window.
    const win = new BrowserWindow({
        ...size,
        webPreferences: {
            nodeIntegration: true
        },
        useContentSize: true,
        frame: false,
        resizable: false
    })

    ipcMain.on('size', (e, width, height) => {
        if (size.width !== width || size.height !== height) {
            size.width = width
            size.height = height
            win.setSize(width, height)
        }
    })

    // and load the index.html of the app.
    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    // Open the DevTools.
    if ((process.env.SHULA ?? '').toLowerCase() === 'dev') {
        win.webContents.openDevTools()
    }

    const menu = createMenu({ win, app, isMac })
    Menu.setApplicationMenu(menu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (isMac) {
        app.quit()
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
