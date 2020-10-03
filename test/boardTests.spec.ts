import { includes, prop } from 'ramda'
import { Cell, createBoard } from '../src/Board'
import { height, width, forEach, Coordinate, Grid, map } from '../src/Grid'

describe('createBoard', () => {
    // Test board:
    // * 2 1  The mine has 1 adjacent mine
    // 2 * 2  The mine has 2 adjacent mine
    // 1 2 *  The mine has 1 adjacent mine
    // 0 1 1
    // 0 0 0

    const minePositions = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 2 }
    ]
    const board = createBoard(3, 5, minePositions)

    it('has the correct dimensions', () => {
        expect(width(board)).toBe(3)
        expect(height(board)).toBe(5)
    })

    it('has mines in a all the specified positions, and only in those positions', () => {
        const positionShouldHaveMine = (c: Coordinate) =>
            includes(c, minePositions)

        forEach((cell: Cell, coordinate: Coordinate): void => {
            const expectMine = positionShouldHaveMine(coordinate)
            expect(cell.isMine).toBe(expectMine)
        }, board)
    })

    it('has correct amounts of adjacent mines for all cells', () => {
        const adjacentGrid: Grid<number> = map(prop('adjacentMines'), board)
        expect(adjacentGrid).toEqual([
            [1, 2, 1],
            [2, 2, 2],
            [1, 2, 1],
            [0, 1, 1],
            [0, 0, 0]
        ])
    })
})
