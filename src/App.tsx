import * as React from 'react'
import { MouseBoardEvent } from './MouseBoard'
import { ipcRenderer } from 'electron'
import { useEffect } from 'react'
import {
    resetStateToDescription,
    resetStateToGameType,
    StartState,
    updateState
} from './AppBoardState'
import { GameComp } from './GameComp'

const App: React.FunctionComponent = () => {
    const [state, setState] = React.useState(StartState)

    useEffect(() => {
        const cb = (_e: unknown, gameType: string) =>
            setState(resetStateToGameType(gameType))
        ipcRenderer.on('gameType', cb)
        return () => {
            ipcRenderer.off('gameType', cb)
        }
    }, [])

    const onEvent = (e: MouseBoardEvent): void =>
        setState(s => updateState(s, e))

    const onClick = () => setState(s => resetStateToDescription(s.description))

    return <GameComp state={state} onEvent={onEvent} onClickSmiley={onClick} />
}

export default App
