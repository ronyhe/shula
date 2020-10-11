import * as React from 'react'
import { Board, Cell, createBoard, expose, toggleFlag } from './Board'
import { Coordinate } from './Grid'
import { getRandomInt } from './utils'
import { range } from 'ramda'
import { BoardComp } from './BoardComp'

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

function createRandomExpertBoard(): Board<Cell> {
    return createRandomBoard(30, 16, 99)
}

const App: React.FunctionComponent = () => {
    const [board, setBoard] = React.useState(createRandomExpertBoard())
    return (
        <BoardComp
            board={board}
            onExpose={coordinate => setBoard(expose(coordinate, board))}
            onFlag={coordinate => setBoard(toggleFlag(coordinate, board))}
        />
    )
}

export default App
