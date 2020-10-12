import {
    assoc,
    filter,
    includes,
    length,
    prop,
    range,
    reduce,
    any,
    both,
    all
} from 'ramda'
import {
    Coordinate,
    get,
    getNeighborCoordinates,
    getNeighborValuesAndCoordinates,
    Grid,
    map,
    update,
    values
} from './Grid'

interface Cell {
    readonly flagged: boolean
    readonly exposed: boolean
    readonly isMine: boolean
    readonly adjacentMines: number
}

type Board<C extends Cell> = Grid<C>

const DefaultCell: Cell = {
    flagged: false,
    exposed: false,
    isMine: false,
    adjacentMines: 0
}

function setMines(
    minePositions: ReadonlyArray<Coordinate>,
    board: Board<Cell>
): Board<Cell> {
    return map((cell, coordinate) => {
        const shouldBeMine = includes(coordinate, minePositions)
        return {
            ...cell,
            isMine: shouldBeMine
        }
    }, board)
}

function countAdjacentMines<C extends Cell>(
    coordinate: Coordinate,
    boardWithMines: Board<C>
) {
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

function setAdjacentMines<C extends Cell>(boardWithMines: Board<C>): Board<C> {
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
): Board<Cell> {
    const row = range(0, width).map(() => DefaultCell)
    const blankBoard = range(0, height).map(() => row)
    const boardWithMines = setMines(minePositions, blankBoard)
    return setAdjacentMines(boardWithMines)
}

function toggleFlag<C extends Cell>(
    coordinate: Coordinate,
    board: Board<C>
): Board<C> {
    const cell = get(coordinate, board)
    if (cell.exposed) {
        return board
    }
    return update(coordinate, assoc('flagged', !cell.flagged), board)
}

function expose<C extends Cell>(
    coordinate: Coordinate,
    board: Board<C>
): Board<C> {
    const cell = get(coordinate, board)
    if (cell.exposed || cell.flagged) {
        return board
    }
    const boardWithExposedCell = update(
        coordinate,
        assoc('exposed', true),
        board
    )
    const moreCellsToExpose =
        cell.adjacentMines === 0
            ? getNeighborCoordinates(coordinate, boardWithExposedCell)
            : []
    return repeat(expose, moreCellsToExpose, boardWithExposedCell)
}

const explodedCell: (cell: Cell) => boolean = both(
    prop('isMine'),
    prop('exposed')
)

function isExploded<C extends Cell>(board: Board<C>): boolean {
    const cells = values(board)
    return any(explodedCell, cells)
}

function isSolved<C extends Cell>(board: Board<C>): boolean {
    const cellIsCorrect: (c: Cell) => boolean = cell => {
        if (cell.isMine) {
            return cell.flagged && !cell.exposed
        }
        return !cell.flagged
    }
    return all(cellIsCorrect, values(board))
}

/** Expose the neighbors of an exposed cell.
 * In the classic minesweeper game this happens when clicking a number
 * with the left and the right mouse buttons at the same time
 */
function exposeNeighbors<C extends Cell>(
    coordinate: Coordinate,
    board: Board<C>
): Board<C> {
    if (!validForNeighborExposure(coordinate, board)) {
        return board
    }
    const coordinatesToExpose = getNeighborCoordinates(coordinate, board)
    return repeat(expose, coordinatesToExpose, board)
}

function validForNeighborExposure<C extends Cell>(
    coordinate: Coordinate,
    board: Board<C>
): boolean {
    const cell = get(coordinate, board)
    if (!cell.exposed || cell.flagged) {
        return false
    }
    const adjacentValuesAndCoordinate = getNeighborValuesAndCoordinates(
        coordinate,
        board
    )
    const flagged = filter(c => c.value.flagged, adjacentValuesAndCoordinate)

    return length(flagged) === cell.adjacentMines
}

function repeat<C extends Cell>(
    action: (coordinate: Coordinate, board: Board<C>) => Board<C>,
    coordinates: ReadonlyArray<Coordinate>,
    board: Board<C>
): Board<C> {
    return reduce(
        (acc, coordinate) => action(coordinate, acc),
        board,
        coordinates
    )
}

export {
    createBoard,
    validForNeighborExposure,
    exposeNeighbors,
    toggleFlag,
    expose,
    isExploded,
    isSolved,
    repeat,
    Cell,
    Board
}
