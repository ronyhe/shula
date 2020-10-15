import * as React from 'react'
import { Board, Cell, createBoard } from './Board'
import { Coordinate } from './Grid'
import { getRandomInt } from './utils'
import { range } from 'ramda'
import { BoardComp } from './BoardComp'
import { createMouseBoard, processEvent } from './MouseBoard'
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

const App: React.FunctionComponent = () => {
    const [board, setBoard] = React.useState(startBoard)
    useEffect(() => {
        const cb = (_e: unknown, gameType: string) => {
            if (gameType === 'beginner') {
                setBoard(createMouseBoard(createRandomBeginnerBoard()))
            } else if (gameType === 'intermediate') {
                setBoard(createMouseBoard(createRandomIntermediateBoard()))
            } else {
                setBoard(createMouseBoard(createRandomExpertBoard()))
            }
        }
        ipcRenderer.on('gameType', cb)
        return () => {
            ipcRenderer.off('gameType', cb)
        }
    }, [])
    return (
        <BoardComp
            board={board}
            onEvent={e => setBoard(processEvent(board, e))}
        />
    )
}

export default App
