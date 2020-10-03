import { adjust, update as ramdaUpdate } from 'ramda'

interface Coordinate {
    readonly x: number
    readonly y: number
}

type Grid<T> = ReadonlyArray<ReadonlyArray<T>>

function height<T>(grid: Grid<T>): number {
    return grid.length
}

function width<T>(grid: Grid<T>): number {
    return grid[0]?.length ?? 0
}

function isValidCoordinate<T>(coordinate: Coordinate, grid: Grid<T>): boolean {
    const { x, y } = coordinate
    return x >= 0 && x < width(grid) && y >= 0 && y < height(grid)
}

function validateCoordinate<T>(
    coordinate: Coordinate,
    grid: Grid<T>
): void | never {
    if (!isValidCoordinate(coordinate, grid)) {
        const w = width(grid)
        const h = height(grid)
        throw new Error(
            `Coordinate ${coordinate} is invalid for grid with height ${h} and width ${w}`
        )
    }
}

function get<T>(coordinate: Coordinate, grid: Grid<T>): T {
    validateCoordinate(coordinate, grid)
    const { x, y } = coordinate
    return grid[y][x]
}

function set<T>(coordinate: Coordinate, t: T, grid: Grid<T>): Grid<T> {
    const { x, y } = coordinate
    return adjust(y, ramdaUpdate(x, t), grid)
}

function update<T>(
    coordinate: Coordinate,
    f: (t: T) => T,
    grid: Grid<T>
): Grid<T> {
    const oldValue = get(coordinate, grid)
    return set(coordinate, f(oldValue), grid)
}

function getNeighborCoordinates<T>(
    coordinate: Coordinate,
    grid: Grid<T>
): ReadonlyArray<Coordinate> {
    validateCoordinate(coordinate, grid)
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
        isValidCoordinate(coordinate, grid)
    )
}

function map<T, A>(
    f: (t: T, coordinate: Coordinate) => A,
    grid: Grid<T>
): Grid<A> {
    return grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) => f(cell, { x: cellIndex, y: rowIndex }))
    )
}

function forEach<T>(
    f: (t: T, coordinate: Coordinate) => void,
    grid: Grid<T>
): void {
    grid.forEach((row, rowIndex) =>
        row.forEach((cell, cellIndex) => f(cell, { x: cellIndex, y: rowIndex }))
    )
}

export {
    Coordinate,
    Grid,
    get,
    set,
    update,
    getNeighborCoordinates,
    map,
    width,
    height,
    isValidCoordinate,
    validateCoordinate,
    forEach
}
