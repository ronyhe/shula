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

        it('throws on invalid coordinates', () => {
            const coordinates = [
                { x: -1, y: 0 },
                { x: 0, y: -1 },
                { x: 3, y: 0 },
                { x: 0, y: 3 }
            ]
            coordinates.forEach(coordinate => {
                expect(() => grid.get(coordinate)).toThrow()
            })
        })
    })
})
