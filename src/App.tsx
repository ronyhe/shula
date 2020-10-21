import * as React from 'react'
import { BoardComp } from './BoardComp'
import { MouseBoardEvent } from './MouseBoard'
import { ipcRenderer } from 'electron'
import { useEffect } from 'react'
import { resetState, StartState, updateState } from './AppBoardState'

const App: React.FunctionComponent = () => {
    const [{ board, endGame }, setState] = React.useState(StartState)

    useEffect(() => {
        const cb = (_e: unknown, gameType: string) =>
            setState(resetState(gameType))
        ipcRenderer.on('gameType', cb)
        return () => {
            ipcRenderer.off('gameType', cb)
        }
    }, [])

    const onEvent = (e: MouseBoardEvent): void =>
        setState(s => updateState(s, e))
    return <BoardComp board={board} endGame={endGame} onEvent={onEvent} />
}

export default App
