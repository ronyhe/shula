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
import { assoc } from 'ramda'
import { Coordinate } from './Grid'

interface AppBoardState {
    readonly board: MouseBoard
    readonly init: boolean
    readonly description: BoardDescription
    readonly endGame: EndGame
}

const startBoard = createBoardFromGameType('expert')

const StartState: AppBoardState = {
    board: startBoard,
    init: false,
    description: StandardDescriptions.expert,
    endGame: { exploded: false, solved: false }
}

function createBoardFromGameType(gameType: string): MouseBoard {
    const description = getStandardBoardDescriptionFromString(gameType)
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
        board
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
        endGame: computeEndGame(newBoard)
    }
}

function updateState(state: AppBoardState, e: MouseBoardEvent): AppBoardState {
    const alreadyEnded = state.endGame.solved || state.endGame.exploded
    if (alreadyEnded) {
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

function resetState(gameType: string): AppBoardState {
    return {
        ...StartState,
        description: getStandardBoardDescriptionFromString(gameType),
        board: createBoardFromGameType(gameType)
    }
}

export { AppBoardState, StartState, updateState, resetState }
