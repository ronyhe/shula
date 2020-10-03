import { includes, range } from 'ramda'
import { Coordinate, Grid, map } from './Grid'

interface Cell {
    readonly flagged: boolean
    readonly exposed: boolean
    readonly isMine: boolean
    readonly adjacentMines: number
}

type Board = Grid<Cell>

const DefaultCell: Cell = {
    flagged: false,
    exposed: false,
    isMine: false,
    adjacentMines: 0
}

function setMines(
    minePositions: ReadonlyArray<Coordinate>,
    board: Board
): Board {
    return map((cell, coordinate) => {
        const shouldBeMine = includes(coordinate, minePositions)
        return {
            ...cell,
            isMine: shouldBeMine
        }
    }, board)
}

function createBoard(
    width: number,
    height: number,
    minePositions: ReadonlyArray<Coordinate>
): Board {
    const row = range(0, width).map(() => DefaultCell)
    const blankBoard = range(0, height).map(() => row)
    return setMines(minePositions, blankBoard)
}

export { createBoard, Cell, Board }
