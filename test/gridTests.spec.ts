import {
    Coordinate,
    Grid,
    get,
    getNeighborCoordinates,
    isValidCoordinate,
    validateCoordinate,
    map,
    set,
    update,
    values
} from '../src/logic/Grid'
import { unnest } from 'ramda'

describe('Grid', () => {
    const grid: Grid<Coordinate> = [
        [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 }
        ],
        [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 }
        ],
        [
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 }
        ]
    ]

    const validCoordinates = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 2 }
    ]

    describe('coordinate validation', () => {
        const invalidCoordinates = [
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 3, y: 0 },
            { x: 0, y: 3 }
        ]

        it('returns the correct validation result, and throws if needed', () => {
            invalidCoordinates.forEach(coordinate => {
                expect(isValidCoordinate(coordinate, grid)).toBe(false)
                expect(() => validateCoordinate(coordinate, grid)).toThrow(
                    'is invalid for grid with height'
                )
            })

            validCoordinates.forEach(coordinate => {
                expect(isValidCoordinate(coordinate, grid)).toBe(true)
                expect(() => validateCoordinate(coordinate, grid)).not.toThrow()
            })
        })

        it('throws on invalid coordinates in the relevant functions', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type GridFunc = (c: Coordinate, g: Grid<Coordinate>) => any
            const functions: GridFunc[] = [get, getNeighborCoordinates]
            invalidCoordinates.forEach(coordinate => {
                functions.forEach(f => {
                    expect(() => f(coordinate, grid)).toThrow(
                        'is invalid for grid with height'
                    )
                })
            })
        })
    })

    it('returns the correct item from get', () => {
        validCoordinates.forEach(coordinate => {
            expect(get(coordinate, grid)).toEqual(coordinate)
        })
    })

    describe('getNeighborCoordinates', () => {
        it('returns correct coordinates for "middle" cells', () => {
            expect(getNeighborCoordinates({ x: 1, y: 1 }, grid)).toEqual([
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 0, y: 1 },
                { x: 2, y: 1 },
                { x: 0, y: 2 },
                { x: 1, y: 2 },
                { x: 2, y: 2 }
            ])
        })

        it('returns correct coordinates for corner cells', () => {
            expect(getNeighborCoordinates({ x: 0, y: 0 }, grid)).toEqual([
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 }
            ])
        })
    })

    it('maps correctly', () => {
        const mapped = map((value, coordinate) => {
            expect(value).toEqual(coordinate)
            return coordinate
        }, grid)
        expect(mapped).toEqual(grid)
    })

    it('returns values', () => {
        expect(values(grid)).toEqual(unnest(grid))
    })

    describe('sets and updates', () => {
        const coordinate = { x: 2, y: 2 }
        const value = { x: 0, y: 0 }

        it('sets correctly', () => {
            const newGrid = set(coordinate, value, grid)
            const cell = get(coordinate, newGrid)
            expect(cell).toEqual(value)
        })

        it('updates correctly', () => {
            const newGrid = update(coordinate, () => value, grid)
            const cell = get(coordinate, newGrid)
            expect(cell).toEqual(value)
        })
    })
})
