import * as React from 'react'
import { Board, Cell, createBoard, isExploded, isSolved } from './Board'
import { Coordinate, Grid } from './Grid'
import { getRandomInt } from './utils'
import { cond, equals, range } from 'ramda'
import { BoardComp, EndGame } from './BoardComp'
import {
    createMouseBoard,
    MouseBoard,
    MouseBoardEvent,
    processEvent
} from './MouseBoard'
import { ipcRenderer } from 'electron'
import { useEffect } from 'react'

function createRandomCoordinate(width: number, height: number): Coordinate {
    return {
        x: getRandomInt(0, width),
        y: getRandomInt(0, height)
    }
}

function createRandomBoard(
    width: number,
    height: number,
    mines: number
): Board<Cell> {
    const mineCoordinates = range(0, mines).map(() =>
        createRandomCoordinate(width, height)
    )
    return createBoard(width, height, mineCoordinates)
}

function createRandomBeginnerBoard(): Board<Cell> {
    return createRandomBoard(9, 9, 10)
}

function createRandomIntermediateBoard(): Board<Cell> {
    return createRandomBoard(16, 16, 40)
}

function createRandomExpertBoard(): Board<Cell> {
    return createRandomBoard(30, 16, 99)
}
const startBoard = createMouseBoard(createRandomExpertBoard())

function createBoardFromGameType(gameType: string): MouseBoard {
    const board: Board<Cell> = cond<string, Grid<Cell>>([
        [equals('beginner'), createRandomBeginnerBoard],
        [equals('intermediate'), createRandomIntermediateBoard],
        [equals('expert'), createRandomExpertBoard]
    ])(gameType)
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
