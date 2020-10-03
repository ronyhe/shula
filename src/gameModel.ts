interface Coordinate {
    x: number
    y: number
}

export interface Cell {
    isMine: boolean
    adjacentMines: number
}

type Row = ReadonlyArray<Cell>

interface BoardDescription {
    width: number
    height: number
    cells: ReadonlyArray<Row>
}

interface GameCell extends Cell {
    flagged: boolean
    exposed: boolean
}

interface GameBoard {
    exploded: boolean
    finished: boolean
    get(coordinate: Coordinate): GameCell
    flag(coordinate: Coordinate): GameBoard
    expose(coordinate: Coordinate): GameBoard
    getNeighborCoordinates(coordinate: Coordinate): ReadonlyArray<Coordinate>
}
