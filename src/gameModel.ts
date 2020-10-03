import { Coordinate, Rows } from './Grid'

interface CellDescription {
    readonly isMine: boolean
    readonly adjacentMines: number
}

interface BoardDescription extends BoardAttributes {
    readonly width: number
    readonly height: number
    readonly mines: number
    readonly cells: Rows<CellDescription>
}

interface Cell extends CellDescription {
    readonly flagged: boolean
    readonly exposed: boolean
}

interface Board {
    readonly exploded: boolean
    readonly finished: boolean
    get(coordinate: Coordinate): Cell
    flag(coordinate: Coordinate): Board
    expose(coordinate: Coordinate): Board
    getNeighborCoordinates(coordinate: Coordinate): ReadonlyArray<Coordinate>
}

interface BoardAttributes {
    readonly width: number
    readonly height: number
    readonly mines: number
}
