import { Coordinate, createGrid, Grid, Rows } from '../src/Grid'

describe('Grid', () => {
    const rows: Rows<Coordinate> = [
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
    const grid: Grid<Coordinate> = createGrid(rows)

    it('throws on invalid coordinates for all public methods', () => {
        const coordinates = [
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 3, y: 0 },
            { x: 0, y: 3 }
        ]
        const method = ['get', 'getNeighborCoordinates']
        method.forEach(name => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const method = (grid as any)[name].bind(grid)
            coordinates.forEach(coordinate => {
                expect(() => method(coordinate)).toThrow(
                    'is invalid for grid with height'
                )
            })
        })
    })

    describe('.get', () => {
        it('returns the correct item', () => {
            const coordinates = [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 2 }
            ]
            coordinates.forEach(coordinate => {
                expect(grid.get(coordinate)).toEqual(coordinate)
            })
        })
    })

    describe('.getNeighborCoordinates', () => {
        it('returns correct coordinates for "middle" cells', () => {
            expect(grid.getNeighborCoordinates({ x: 1, y: 1 })).toEqual([
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
            expect(grid.getNeighborCoordinates({ x: 0, y: 0 })).toEqual([
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 }
            ])
        })
    })
})
