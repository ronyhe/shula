import { Coordinate } from './Grid'
import { getRandomInt } from './utils'
import { Board, Cell, createBoard } from './Board'
import { includes, keys, range, toLower } from 'ramda'

interface BoardDimensions {
    readonly width: number
    readonly height: number
}

interface BoardDescription extends BoardDimensions {
    readonly mines: number
}

type StandardGameType = 'beginner' | 'intermediate' | 'expert'

const StandardDescriptions: Record<StandardGameType, BoardDescription> = {
    beginner: { width: 9, height: 9, mines: 10 },
    intermediate: { width: 16, height: 16, mines: 40 },
    expert: { width: 30, height: 16, mines: 99 }
}

function createRandomCoordinate(width: number, height: number): Coordinate {
    return {
        x: getRandomInt(0, width),
        y: getRandomInt(0, height)
    }
}

function createRandomBoard({
    width,
    height,
    mines
}: BoardDescription): Board<Cell> {
    const mineCoordinates = range(0, mines).map(() =>
        createRandomCoordinate(width, height)
    )
    return createBoard(width, height, mineCoordinates)
}

function createStandardBoard(type: StandardGameType): Board<Cell> {
    return createRandomBoard(StandardDescriptions[type])
}

function createStandardBoardFromString(name: string): Board<Cell> {
    const lower = toLower(name)
    if (!includes(lower, keys(StandardDescriptions))) {
        throw new Error(`${lower} is not a standard game type`)
    }
    return createStandardBoard(lower as StandardGameType)
}

export {
    BoardDimensions,
    BoardDescription,
    StandardGameType,
    StandardDescriptions,
    createStandardBoard,
    createStandardBoardFromString
}
