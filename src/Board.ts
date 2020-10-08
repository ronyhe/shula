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
    all,
    partition,
    path,
    map as ramdaMap
} from 'ramda'
import {
    Coordinate,
    CoordinateValues,
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
        return board
    }
    return update(coordinate, assoc('flagged', true), board)
}

function expose(coordinate: Coordinate, board: Board): Board {
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

function isExploded(board: Board): boolean {
    const cells = values(board)
    return any(explodedCell, cells)
}

function isSolved(board: Board): boolean {
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
function exposeNeighbors(coordinate: Coordinate, board: Board): Board {
    const cell = get(coordinate, board)
    if (!cell.exposed || cell.flagged || cell.isMine) {
        return board
    }

    const adjacentValuesAndCoordinate = getNeighborValuesAndCoordinates(
        coordinate,
        board
    )
    const [flagged, notFlagged]: [
        CoordinateValues<Cell>,
        CoordinateValues<Cell>
    ] = partition(path(['value', 'flagged']), adjacentValuesAndCoordinate)

    if (length(flagged) !== cell.adjacentMines) {
        return board
    }

    const coordinatesToExpose = ramdaMap(prop('coordinate'), notFlagged)
    return repeat(expose, coordinatesToExpose, board)
}

function repeat(
    action: (coordinate: Coordinate, board: Board) => Board,
    coordinates: ReadonlyArray<Coordinate>,
    board: Board
): Board {
    return reduce(
        (acc, coordinate) => action(coordinate, acc),
        board,
        coordinates
    )
}

export {
    createBoard,
    exposeNeighbors,
    flag,
    expose,
    isExploded,
    isSolved,
    repeat,
    Cell,
    Board
}
