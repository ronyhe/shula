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

    useEffect(() => {
        const timer = setInterval(() => {
            setState(tick)
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    useLayoutEffect(sendSize, [state.description])

    const onEvent = (e: MouseBoardEvent): void =>
        setState(s => updateState(s, e))

    const onClick = () => setState(s => resetStateToDescription(s.description))

    return <GameComp state={state} onEvent={onEvent} onClickSmiley={onClick} />
}

export default App
