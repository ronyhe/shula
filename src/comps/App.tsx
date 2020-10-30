import * as React from 'react'
import { MouseBoardEvent } from '../logic/MouseBoard'
import { ipcRenderer } from 'electron'
import { useEffect, useLayoutEffect } from 'react'
import {
    resetStateToDescription,
    resetStateToGameType,
    StartState,
    tick,
    updateState
} from '../logic/GameState'
import { GameComp } from './GameComp'

function sendSize(): void {
    const root = document.getElementById('root')
    if (!root) {
        return
    }
    const width = root.offsetWidth
    const height = root.offsetHeight
    if (width > 0 && height > 0) {
        ipcRenderer.send('size', width, height)
    }
}

interface AppParams {
    readonly mediaSourceId: string
}

const App: React.FunctionComponent<AppParams> = () => {
    const [state, setState] = React.useState(StartState)

    useEffect(() => {
        const cb = (_e: unknown, gameType: string) =>
            setState(resetStateToGameType(gameType))
        ipcRenderer.on('gameType', cb)
        return () => {
            ipcRenderer.off('gameType', cb)
        }
    }, [])

    useEffect(() => {
        const cb = () =>
            setState(s => resetStateToDescription(s, s.description))

        ipcRenderer.on('newGame', cb)
        return () => {
            ipcRenderer.off('newGame', cb)
        }
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setState(tick)
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    useLayoutEffect(sendSize, [state.description])

    const onEvent = (e: MouseBoardEvent): void =>
        setState(s => updateState(s, e))

    const onClickSmiley = () =>
        setState(s => resetStateToDescription(s, s.description))

    return (
        <GameComp
            state={state}
            onEvent={onEvent}
            onClickSmiley={onClickSmiley}
        />
    )
}

export default App
