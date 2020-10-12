import { Board, Cell, expose, toggleFlag } from './Board'
import { Coordinate, map, set, update } from './Grid'
import {
    always,
    assoc,
    evolve,
    F,
    identity,
    ifElse,
    lensProp,
    over,
    prop,
    reduce,
    T
} from 'ramda'

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

function _processEvent(board: MouseBoard, event: MouseBoardEvent): MouseBoard {
    if (event === 'reset') {
        return attachDefaults(board.board)
    }
    if (event === 'leave') {
        return assoc('pointer', null, board)
    }
    if (event === 'upLeft') {
        return evolve({
            left: F,
            board: b => (board.pointer ? expose(board.pointer, b) : b)
        })(board)
    }
    if (event === 'upRight') {
        return assoc('right', false, board)
    }
    if (event === 'downLeft') {
        return evolve(
            {
                left: T,
                board: b =>
                    board.pointer
                        ? update(board.pointer, assoc('indent', true), b)
                        : b
            },
            board
        )
    }
    if (event === 'downRight') {
        return evolve({
            right: T,
            board: b => (board.pointer ? toggleFlag(board.pointer, b) : b)
        })(board)
    }
    const pointer: Coordinate = event
    return evolve(
        {
            pointer: always(pointer),
            board: b =>
                board.left ? update(pointer, assoc('indent', true), b) : b
        },
        board
    )
}

const indentCellIfExposed: (cell: MouseCell) => MouseCell = ifElse(
    prop('exposed'),
    assoc('indent', true),
    identity
)

const indentExposedCells: (board: MouseBoard) => MouseBoard = over(
    lensProp('board'),
    b => map(indentCellIfExposed, b)
)

function processEvent(board: MouseBoard, event: MouseBoardEvent): MouseBoard {
    const processed = _processEvent(board, event)
    return indentExposedCells(processed)
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
