import {
    createMouseBoard,
    MouseBoard,
    MouseBoardEvent,
    processEvent,
    processEvents
} from './MouseBoard'
import {
    BoardDescription,
    createRandomBoard,
    getStandardBoardDescriptionFromString,
    StandardDescriptions
} from './boardCreations'
import { EndGame } from './BoardComp'
import { Board, Cell, isExploded, isSolved } from './Board'
import { assoc, inc, lensProp, over } from 'ramda'
import { Coordinate } from './Grid'

interface AppBoardState {
    readonly board: MouseBoard
    readonly init: boolean
    readonly description: BoardDescription
    readonly endGame: EndGame
    readonly time: number
}

const startBoard = createBoardFromGameType('expert')

const StartState: AppBoardState = {
    board: startBoard,
    init: false,
    description: StandardDescriptions.expert,
    endGame: { exploded: false, solved: false },
    time: 0
}

function createBoardFromGameType(gameType: string): MouseBoard {
    return createBoardFromDescription(
        getStandardBoardDescriptionFromString(gameType)
    )
}

function createBoardFromDescription(description: BoardDescription): MouseBoard {
    const board: Board<Cell> = createRandomBoard(description, { x: -1, y: -1 })
    return createMouseBoard(board)
}

function computeEndGame({ board }: MouseBoard): EndGame {
    return {
        solved: isSolved(board),
        exploded: isExploded(board)
    }
}

function normalUpdate(state: AppBoardState, e: MouseBoardEvent): AppBoardState {
    const board = processEvent(state.board, e)
    return {
        init: true,
        description: state.description,
        endGame: computeEndGame(board),
        board,
        time: state.time
    }
}

function createNewBoard(state: AppBoardState, pointer: Coordinate) {
    const newBoard = createMouseBoard(
        createRandomBoard(state.description, pointer)
    )
    const processed = processEvents(newBoard, [pointer, 'upLeft'])
    return {
        init: true,
        description: state.description,
        board: processed,
        endGame: computeEndGame(newBoard),
        time: 0
    }
}

function ended({ solved, exploded }: EndGame): boolean {
    return solved || exploded
}

function updateState(state: AppBoardState, e: MouseBoardEvent): AppBoardState {
    if (ended(state.endGame)) {
        return state
    }
    const normal = normalUpdate(state, e)
    if (state.init) {
        return normal
    }
    if (state.board.pointer && e === 'downRight') {
        return normal
    }
    if (state.board.pointer && e === 'upLeft') {
        if (normal.endGame.exploded) {
            return createNewBoard(state, state.board.pointer)
        } else {
            return normal
        }
    }
    return assoc('init', false, normal)
}

function resetStateToGameType(gameType: string): AppBoardState {
    return {
        ...StartState,
        description: getStandardBoardDescriptionFromString(gameType),
        board: createBoardFromGameType(gameType)
    }
}

function resetStateToDescription(description: BoardDescription): AppBoardState {
    return {
        ...StartState,
        description,
        board: createBoardFromDescription(description)
    }
}

function tick(state: AppBoardState): AppBoardState {
    if (state.init && !ended(state.endGame)) {
        return over(lensProp('time'), inc, state)
    }
    return state
}

export {
    AppBoardState,
    StartState,
    updateState,
    resetStateToGameType,
    resetStateToDescription,
    tick
}
