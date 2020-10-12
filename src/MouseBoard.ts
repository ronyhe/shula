import {
    Board,
    Cell,
    expose,
    exposeNeighbors,
    toggleFlag,
    validForNeighborExposure
} from './Board'
import {
    Coordinate,
    coordinates,
    get,
    getNeighborCoordinates,
    getNeighborValuesAndCoordinates,
    map,
    update
} from './Grid'
import { assoc, identity, ifElse, lensProp, over, prop, reduce } from 'ramda'

interface MouseCell extends Cell {
    readonly indent: boolean
}

interface MouseBoard {
    readonly board: Board<MouseCell>
    readonly left: boolean
    readonly right: boolean
    readonly pointer: Coordinate | null
}

type MouseBoardEvent =
    | 'reset'
    | 'leave'
    | 'upLeft'
    | 'upRight'
    | 'downLeft'
    | 'downRight'
    | Coordinate

const indentCell: (c: MouseCell) => MouseCell = assoc('indent', true)

const deDentCell: (c: MouseCell) => MouseCell = assoc('indent', false)

function deDentAll(board: MouseBoard): MouseBoard {
    return {
        ...board,
        board: map(deDentCell, board.board)
    }
}

function indentCells(
    board: MouseBoard,
    coordinates: ReadonlyArray<Coordinate>
): MouseBoard {
    return {
        ...board,
        board: reduce(
            (acc, coordinate) => update(coordinate, indentCell, acc),
            board.board,
            coordinates
        )
    }
}

function attachDefaults(board: Board<MouseCell>): MouseBoard {
    return {
        board,
        left: false,
        right: false,
        pointer: null
    }
}

function createMouseBoard(board: Board<Cell>): MouseBoard {
    const mouseBoard = map(assoc('indent', false), board)
    return attachDefaults(mouseBoard)
}

function updateMouseState(
    board: MouseBoard,
    event: MouseBoardEvent
): MouseBoard {
    if (event === 'reset') {
        return attachDefaults(board.board)
    }
    if (event === 'leave') {
        return assoc('pointer', null, board)
    }
    if (event === 'upLeft') {
        return assoc('left', false, board)
    }
    if (event === 'upRight') {
        return assoc('right', false, board)
    }
    if (event === 'downLeft') {
        return assoc('left', true, board)
    }
    if (event === 'downRight') {
        return assoc('right', true, board)
    }
    return assoc('pointer', event, board)
}

const indentCellIfExposed: (cell: MouseCell) => MouseCell = ifElse(
    prop('exposed'),
    indentCell,
    identity
)

const indentExposedCells: (board: MouseBoard) => MouseBoard = over(
    lensProp('board'),
    b => map(indentCellIfExposed, b)
)

function updateFlags(board: MouseBoard, event: MouseBoardEvent): MouseBoard {
    if (event === 'downRight' && board.pointer) {
        return {
            ...board,
            board: toggleFlag(board.pointer, board.board)
        }
    }
    return board
}

function updateExposed(board: MouseBoard, event: MouseBoardEvent): MouseBoard {
    if (event === 'upLeft' && board.pointer) {
        return {
            ...board,
            board: expose(board.pointer, board.board)
        }
    }
    return board
}

function updateLeftButtonIndentation(board: MouseBoard): MouseBoard {
    if (board.left && board.pointer) {
        return {
            ...board,
            board: update(board.pointer, indentCell, board.board)
        }
    }
    return board
}

function updateChordIndent(board: MouseBoard): MouseBoard {
    if (
        board.left &&
        board.right &&
        board.pointer &&
        get(board.pointer, board.board).exposed
    ) {
        return indentCells(
            board,
            getNeighborCoordinates(board.pointer, board.board)
        )
    }
    return board
}

function updateChord(board: MouseBoard, event: MouseBoardEvent): MouseBoard {
    const chordPickUp =
        (board.left && event === 'upRight') ||
        (board.right && event === 'upLeft')
    if (
        chordPickUp &&
        board.pointer &&
        validForNeighborExposure(board.pointer, board.board)
    ) {
        return {
            ...board,
            board: exposeNeighbors(board.pointer, board.board)
        }
    }
    return board
}

function processEvent(board: MouseBoard, event: MouseBoardEvent): MouseBoard {
    const noIndents = deDentAll(board)
    const mouseState = updateMouseState(noIndents, event)
    const flags = updateFlags(mouseState, event)
    const exposed = updateExposed(flags, event)
    const leftIndent = updateLeftButtonIndentation(exposed)
    const chordIndent = updateChordIndent(leftIndent)
    const chord = updateChord(chordIndent, event)
    return indentExposedCells(chord)
}

const processEvents: (
    board: MouseBoard,
    events: ReadonlyArray<MouseBoardEvent>
) => MouseBoard = reduce(processEvent)

export {
    MouseCell,
    MouseBoard,
    MouseBoardEvent,
    createMouseBoard,
    processEvent,
    processEvents
}
