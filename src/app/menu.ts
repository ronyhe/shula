import { App, BrowserWindow, Menu } from 'electron'

interface MenuParams {
    readonly win: BrowserWindow
    readonly app: App
    readonly isMac: boolean
}

function createMenu({ win, app, isMac }: MenuParams): Menu {
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
                    label: 'New Game',
                    click: () => win.webContents.send('newGame'),
                    accelerator: 'F2'
                },
                { type: 'separator' },
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

export { MenuParams, createMenu }
