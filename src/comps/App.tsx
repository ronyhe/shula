import * as React from 'react'
import { GameResult, GameWithStateComp } from './GameWithStateComp'
import { useResource } from './hooks'
import { Video, getMediaStream, saveFile } from '../app/Video'
import { MenuComp } from './MenuComp'
import { Menu } from '../app/menu'

interface AppParams {
    readonly mediaSourceId: string
    readonly initialGameType: string
    readonly isMac: boolean
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
        displayName: 'Refresh',
        keyCombo: null,
        handler: () => {
            console.log('refresh')
        }
    },
    {
        displayName: 'Open DevTools',
        keyCombo: null,
        handler: () => {
            console.log('dev tools')
        }
    },
    {
        displayName: 'Quit',
        keyCombo: null,
        handler: () => {
            console.log('quit')
        }
    }
]

const App: React.FunctionComponent<AppParams> = ({
    mediaSourceId,
    initialGameType,
    isMac
}) => {
    const [showingMenu, setShowingMenu] = React.useState(false)
    const stream = useResource(() => getMediaStream(mediaSourceId))
    if (stream === 'processing') {
        return <div>Loading...</div>
    }
    if (stream instanceof Error) {
        return <div>{`Error: ${stream.message}`}</div>
    }
    const video = new Video(stream)

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
