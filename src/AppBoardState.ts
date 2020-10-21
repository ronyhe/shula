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

function updateState(state: AppBoardState, e: MouseBoardEvent): AppBoardState {
    const alreadyEnded = state.endGame.solved || state.endGame.exploded
    if (alreadyEnded) {
        return state
    }
    if (state.init) {
        const board = processEvent(state.board, e)
        return {
            init: true,
            description: state.description,
            endGame: computeEndGame(board),
            board
        }
    }
    if (state.board.pointer && e === 'upLeft') {
        const board = processEvent(state.board, e)
        const endGame = computeEndGame(board)
        if (endGame.exploded) {
            const newBoard = createMouseBoard(
                createRandomBoard(state.description, state.board.pointer)
            )
            const processed = processEvents(newBoard, [state.board.pointer, e])
            return {
                init: true,
                description: state.description,
                board: processed,
                endGame: computeEndGame(newBoard)
            }
        } else {
            return {
                init: true,
                description: state.description,
                endGame,
                board
            }
        }
    }
    if (state.board.pointer && e === 'downRight') {
        const board = processEvent(state.board, e)
        return {
            init: true,
            description: state.description,
            endGame: computeEndGame(board),
            board
        }
    }
    const board = processEvent(state.board, e)
    return {
        init: false,
        description: state.description,
        endGame: computeEndGame(board),
        board
    }
}

function resetState(gameType: string): AppBoardState {
    return {
        ...StartState,
        description: getStandardBoardDescriptionFromString(gameType),
        board: createBoardFromGameType(gameType)
    }
}

export { AppBoardState, StartState, updateState, resetState }
