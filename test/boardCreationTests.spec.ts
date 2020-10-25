import { Cell } from '../src/logic/Board'
import {
    Coordinate,
    forEach,
    Grid,
    height,
    map,
    width
} from '../src/logic/Grid'
import { includes, prop } from 'ramda'
import { board, minePositions } from './testBoard'

it('has the correct dimensions', () => {
    expect(width(board)).toBe(3)
    expect(height(board)).toBe(5)
})

it('has mines in a all the specified positions, and only in those positions', () => {
    const positionShouldHaveMine = (c: Coordinate) => includes(c, minePositions)

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
