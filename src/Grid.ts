interface Coordinate {
    readonly x: number
    readonly y: number
}

type Rows<T> = ReadonlyArray<ReadonlyArray<T>>

interface Grid<T> {
    readonly width: number
    readonly height: number
    get(coordinate: Coordinate): T
    getNeighborCoordinates(coordinate: Coordinate): ReadonlyArray<Coordinate>
    map<A>(f: (t: T, coordinate: Coordinate) => A): Grid<A>
}

class GridImpl<T> implements Grid<T> {
    readonly height: number
    readonly width: number

    constructor(private readonly items: Rows<T>) {
        this.height = items.length
        this.width = items[0]?.length ?? 0
        if (!this.items.every(row => row.length === this.width)) {
            throw new Error('All rows in a Grid must have the same width')
        }
    }

    private isValidCoordinate(coordinate: Coordinate): boolean {
        const { width, height } = this
        const { x, y } = coordinate
        return x >= 0 && x < width && y >= 0 && y < height
    }

    private validateCoordinate(coordinate: Coordinate): void | never {
        if (!this.isValidCoordinate(coordinate)) {
            const { width, height } = this
            throw new Error(
                `Coordinate ${coordinate} is invalid for grid with height ${height} and width ${width}`
            )
        }
    }

    get(coordinate: Coordinate): T {
        this.validateCoordinate(coordinate)
        const { x, y } = coordinate
        return this.items[y][x]
    }

    getNeighborCoordinates(coordinate: Coordinate): ReadonlyArray<Coordinate> {
        this.validateCoordinate(coordinate)
        const { x, y } = coordinate
        const above = [
            { x: x - 1, y: y - 1 },
            { x, y: y - 1 },
            { x: x + 1, y: y - 1 }
        ]
        const sameRow = [
            { x: x - 1, y },
            { x: x + 1, y }
        ]
        const below = [
            { x: x - 1, y: y + 1 },
            { x, y: y + 1 },
            { x: x + 1, y: y + 1 }
        ]
        const allCoordinates = [...above, ...sameRow, ...below]
        return allCoordinates.filter(coordinate =>
            this.isValidCoordinate(coordinate)
        )
    }

    map<A>(f: (t: T, coordinate: Coordinate) => A): Grid<A> {
        return new GridImpl(
            this.items.map((row, rowIndex) =>
                row.map((cell, cellIndex) =>
                    f(cell, { x: cellIndex, y: rowIndex })
                )
            )
        )
    }
}

function createGrid<T>(items: Rows<T>): Grid<T> {
    return new GridImpl(items)
}

export { Grid, Rows, Coordinate, createGrid }
