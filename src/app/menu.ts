import { App, BrowserWindow, Menu } from 'electron'
import Store from 'electron-store'

interface MenuParams {
    readonly win: BrowserWindow
    readonly app: App
    readonly isMac: boolean
    readonly store: Store<Record<string, string>>
}

function sendGameType(gameType: string, { store, win }: MenuParams): void {
    win.webContents.send('gameType', gameType)
    store.set('gameType', gameType)
}

function createMenu(menuParams: MenuParams): Menu {
    const { win, app, isMac } = menuParams
    return Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {
                    label: 'Beginner',
                    click: () => sendGameType('beginner', menuParams)
                },
                {
                    label: 'Intermediate',
                    click: () => sendGameType('intermediate', menuParams)
                },
                {
                    label: 'Expert',
                    click: () => sendGameType('expert', menuParams)
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
