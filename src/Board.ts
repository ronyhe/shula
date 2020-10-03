import { assoc, filter, includes, length, prop, range } from 'ramda'
import {
    Coordinate,
    get,
    getNeighborCoordinates,
    Grid,
    map,
    update
} from './Grid'

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

function countAdjacentMines(coordinate: Coordinate, boardWithMines: Board) {
    const adjacentCoordinates = getNeighborCoordinates(
        coordinate,
        boardWithMines
    )
    const adjacentCells = adjacentCoordinates.map(coordinate =>
        get(coordinate, boardWithMines)
    )
    const mines = filter(prop('isMine'), adjacentCells)
    return length(mines)
}

function setAdjacentMines(boardWithMines: Board): Board {
    const count = (coordinate: Coordinate) =>
        countAdjacentMines(coordinate, boardWithMines)
    return map(
        (cell, coordinate) => assoc('adjacentMines', count(coordinate), cell),
        boardWithMines
    )
}

function createBoard(
    width: number,
    height: number,
    minePositions: ReadonlyArray<Coordinate>
): Board {
    const row = range(0, width).map(() => DefaultCell)
    const blankBoard = range(0, height).map(() => row)
    const boardWithMines = setMines(minePositions, blankBoard)
    return setAdjacentMines(boardWithMines)
}

function flag(coordinate: Coordinate, board: Board): Board {
    const cell = get(coordinate, board)
    if (cell.exposed) {
        throw new Error(`Cannot flag exposed cell at ${coordinate}`)
    }
    return update(coordinate, assoc('flagged', true), board)
}

export { createBoard, flag, Cell, Board }
