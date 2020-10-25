import { App, BrowserWindow, Menu } from 'electron'

function createMenu(win: BrowserWindow, app: App, isMac: boolean): Menu {
    return Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {
                    label: 'Beginner',
                    click: () => win.webContents.send('gameType', 'beginner')
                },
                {
                    label: 'Intermediate',
                    click: () =>
                        win.webContents.send('gameType', 'intermediate')
                },
                {
                    label: 'Expert',
                    click: () => win.webContents.send('gameType', 'expert')
                },
                {
                    label: 'Open DevTools',
                    click: () => {
                        win.webContents.openDevTools()
                    },
                    accelerator: 'F12'
                },
                {
                    label: 'Refresh',
                    click: () => {
                        win.reload()
                    },
                    accelerator: 'CmdOrCtrl+R'
                },
                {
                    label: 'Quit',
                    click: () => {
                        app.quit()
                    },
                    accelerator: isMac ? 'Cmd+Q' : 'Alt+F4'
                }
            ]
        }
    ])
}

export { createMenu }
