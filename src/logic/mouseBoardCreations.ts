import { createMouseBoard, MouseBoard } from './MouseBoard'
import {
    BoardDescription,
    createRandomBoard,
    getStandardBoardDescriptionFromString
} from './boardCreations'
import { Board, Cell } from './Board'

function createBoardFromGameType(gameType: string): MouseBoard {
    return createBoardFromDescription(
        getStandardBoardDescriptionFromString(gameType)
    )
}

function createBoardFromDescription(description: BoardDescription): MouseBoard {
    const board: Board<Cell> = createRandomBoard(description, { x: -1, y: -1 })
    return createMouseBoard(board)
}

export { createBoardFromDescription, createBoardFromGameType }
