import { BrowserWindow, Menu } from 'electron'

function createMenu(win: BrowserWindow): Menu {
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
                    label: 'Refresh',
                    click: () => {
                        win.reload()
                    },
                    accelerator: 'CmdOrCtrl+R'
                },
                {
                    label: 'Open DevTools',
                    click: () => {
                        win.webContents.openDevTools()
                    },
                    accelerator: 'F12'
                }
            ]
        }
    ])
}

export { createMenu }
