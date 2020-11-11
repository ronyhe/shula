import * as React from 'react'
import { remote, ipcRenderer } from 'electron'
import { GameResult, GameWithStateComp } from './GameWithStateComp'
import { Video, saveFile } from '../app/Video'
import { MenuComp } from './MenuComp'
import { Menu, registerKeyCombos } from '../app/menu'
import { useEffect } from 'react'

interface AppParams {
    readonly initialGameType: string
    readonly isMac: boolean
    readonly video: Video
}

async function stopVideoAndSaveFile(
    video: Video,
    gameResult: GameResult
): Promise<void> {
    const blob = await video.stop()
    if (gameResult.solved) {
        await saveFile(blob, gameResult.elapsedTimeMillis)
    }
}

const appEvents = new EventTarget()

const menu: Menu = [
    {
        displayName: 'Beginner',
        keyCombo: null,
        handler: () =>
            appEvents.dispatchEvent(
                new CustomEvent('gameType', { detail: 'beginner' })
            )
    },
    {
        displayName: 'Intermediate',
        keyCombo: null,
        handler: () =>
            appEvents.dispatchEvent(
                new CustomEvent('gameType', { detail: 'intermediate' })
            )
    },
    {
        displayName: 'Expert',
        keyCombo: null,
        handler: () =>
            appEvents.dispatchEvent(
                new CustomEvent('gameType', { detail: 'expert' })
            )
    },
    {
        displayName: 'New Game',
        keyCombo: {
            text: 'F2',
            ctrlOrCmd: false
        },
        handler: () => appEvents.dispatchEvent(new Event('newGame'))
    },
    {
        displayName: 'Refresh',
        keyCombo: {
            text: 'r',
            ctrlOrCmd: true
        },
        handler: () => {
            remote.getCurrentWindow().reload()
        }
    },
    {
        displayName: 'Open DevTools',
        keyCombo: null,
        handler: () => {
            remote.getCurrentWindow().webContents.openDevTools()
        }
    },
    {
        displayName: 'Quit',
        keyCombo: {
            text: 'q',
            ctrlOrCmd: true
        },
        handler: () => {
            ipcRenderer.send('quit')
        }
    }
]

const App: React.FunctionComponent<AppParams> = ({
    initialGameType,
    isMac,
    video
}) => {
    const [showingMenu, setShowingMenu] = React.useState(false)
    useEffect(
        () => registerKeyCombos(isMac, menu, () => setShowingMenu(false)),
        []
    )
    const onInit = () => {
        video.start()
    }
    const onFinish = (gameResult: GameResult) => {
        stopVideoAndSaveFile(video, gameResult).catch(e => {
            console.error(e)
            alert(`Unable to save video: ${e.message}`)
        })
    }
    return (
        <React.Fragment>
            <div
                className="menu-catch"
                onMouseEnter={() => setShowingMenu(true)}
            />
            <MenuComp
                onClose={() => setShowingMenu(false)}
                show={showingMenu}
                isMac={isMac}
                items={menu}
            />
            <GameWithStateComp
                appEvents={appEvents}
                isMac={isMac}
                onInit={onInit}
                onFinish={onFinish}
                initialGameType={initialGameType}
            />
        </React.Fragment>
    )
}

export default App
