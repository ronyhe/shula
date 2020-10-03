import { Coordinate, Grid } from './Grid'
import { range } from './utils'

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

function createBoard(
    width: number,
    height: number,
    minePositions: ReadonlyArray<Coordinate>
): Board {
    const row = range(width).map(() => DefaultCell)
    return range(height).map(() => row)
}

export { createBoard }
