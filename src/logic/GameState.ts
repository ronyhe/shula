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
import { EndGame } from '../comps/BoardComp'
import { isExploded, isSolved } from './Board'
import { assoc, inc, lensProp, over } from 'ramda'
import { Coordinate } from './Grid'
import {
    createBoardFromDescription,
    createBoardFromGameType
} from './mouseBoardCreations'

interface GameState {
    readonly board: MouseBoard
    readonly init: boolean
    readonly description: BoardDescription
    readonly endGame: EndGame
    readonly time: number
}

const startBoard = createBoardFromGameType('expert')

const StartState: GameState = {
    board: startBoard,
    init: false,
    description: StandardDescriptions.expert,
    endGame: { exploded: false, solved: false },
    time: 0
}

function computeEndGame({ board }: MouseBoard): EndGame {
    return {
        solved: isSolved(board),
        exploded: isExploded(board)
    }
}

function normalUpdate(state: GameState, e: MouseBoardEvent): GameState {
    const board = processEvent(state.board, e)
    return {
        init: true,
        description: state.description,
        endGame: computeEndGame(board),
        board,
        time: state.time
    }
}

function createNewBoard(state: GameState, pointer: Coordinate) {
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

function updateState(state: GameState, e: MouseBoardEvent): GameState {
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

function resetStateToGameType(gameType: string): GameState {
    return {
        ...StartState,
        description: getStandardBoardDescriptionFromString(gameType),
        board: createBoardFromGameType(gameType)
    }
}

function resetStateToDescription(
    state: GameState,
    description: BoardDescription
): GameState {
    const newState = {
        ...StartState,
        description,
        board: createBoardFromDescription(description)
    }
    const pointer = state.board.pointer
    if (pointer) {
        return updateState(newState, pointer)
    }
    return newState
}

function tick(state: GameState): GameState {
    if (state.init && !ended(state.endGame)) {
        return over(lensProp('time'), inc, state)
    }
    return state
}

export {
    GameState,
    StartState,
    updateState,
    resetStateToGameType,
    resetStateToDescription,
    tick
}
