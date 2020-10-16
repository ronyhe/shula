import * as React from 'react'
import { Board, Cell, isExploded, isSolved } from './Board'
import { BoardComp, EndGame } from './BoardComp'
import {
    createMouseBoard,
    MouseBoard,
    MouseBoardEvent,
    processEvent
} from './MouseBoard'
import { ipcRenderer } from 'electron'
import { useEffect } from 'react'
import {
    createStandardBoard,
    createStandardBoardFromString
} from './boardCreations'

const startBoard = createMouseBoard(createStandardBoard('expert'))

function createBoardFromGameType(gameType: string): MouseBoard {
    const board: Board<Cell> = createStandardBoardFromString(gameType)
    return createMouseBoard(board)
}

const App: React.FunctionComponent = () => {
    const [board, setBoard] = React.useState(startBoard)
    const endGame: EndGame = {
        exploded: isExploded(board.board),
        solved: isSolved(board.board)
    }

    useEffect(() => {
        const cb = (_e: unknown, gameType: string) =>
            setBoard(createBoardFromGameType(gameType))
        ipcRenderer.on('gameType', cb)
        return () => {
            ipcRenderer.off('gameType', cb)
        }
    }, [])

    const onEvent: (e: MouseBoardEvent) => void =
        endGame.exploded || endGame.solved
            ? () => null
            : e => setBoard(processEvent(board, e))
    return <BoardComp board={board} endGame={endGame} onEvent={onEvent} />
}

export default App
