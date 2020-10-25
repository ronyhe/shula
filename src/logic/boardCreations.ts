import { Coordinate } from './Grid'
import { getRandomInt } from './utils'
import { Board, Cell, createBoard } from './Board'
import { equals, includes, keys, range, toLower } from 'ramda'

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

function createRandomCoordinate(
    dimensions: BoardDimensions,
    exclude: Coordinate
): Coordinate {
    const { width, height } = dimensions
    const coordinate = {
        x: getRandomInt(0, width),
        y: getRandomInt(0, height)
    }
    if (equals(coordinate, exclude)) {
        return createRandomCoordinate(dimensions, exclude)
    }
    return coordinate
}

function createRandomBoard(
    { width, height, mines }: BoardDescription,
    exclude: Coordinate
): Board<Cell> {
    const mineCoordinates = range(0, mines).map(() =>
        createRandomCoordinate({ width, height }, exclude)
    )
    return createBoard(width, height, mineCoordinates)
}

function getStandardBoardDescriptionFromString(name: string): BoardDescription {
    const lower = toLower(name)
    if (!includes(lower, keys(StandardDescriptions))) {
        throw new Error(`${lower} is not a standard game type`)
    }
    return StandardDescriptions[lower as StandardGameType]
}

export {
    BoardDimensions,
    BoardDescription,
    StandardGameType,
    StandardDescriptions,
    getStandardBoardDescriptionFromString,
    createRandomBoard
}
