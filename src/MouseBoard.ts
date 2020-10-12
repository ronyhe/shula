import { Board, Cell, expose, toggleFlag } from './Board'
import { Coordinate, map } from './Grid'
import { assoc, evolve, F, identity, ifElse, path, reduce, T } from 'ramda'

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
        return assoc('left', true, board)
    }
    if (event === 'downRight') {
        return evolve({
            right: T,
            board: b => (board.pointer ? toggleFlag(board.pointer, b) : b)
        })(board)
    }
    return assoc('pointer', event, board)
}

function indentExposedCells(board: MouseBoard): MouseBoard {
    return {
        ...board,
        board: map(
            cell => (cell.exposed ? { ...cell, indent: true } : cell),
            board.board
        )
    }
}

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
