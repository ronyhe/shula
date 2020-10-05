import { assoc, includes, prop } from 'ramda'
import { Cell, createBoard, flag, expose, isExploded } from '../src/Board'
import {
    height,
    width,
    forEach,
    Coordinate,
    Grid,
    map,
    get,
    update
} from '../src/Grid'

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

    describe('flagging', () => {
        const coordinate = { x: 0, y: 0 }

        it('works for unexposed cells', () => {
            const newBoard = flag(coordinate, board)
            const cell = get(coordinate, newBoard)
            expect(cell.flagged).toBe(true)
        })

        it('throws for exposed cells', () => {
            const newBoard = update(coordinate, assoc('exposed', true), board)
            expect(() => flag(coordinate, newBoard)).toThrow(
                'Cannot flag exposed cell at'
            )
        })
    })

    describe('exposing', () => {
        const coordinate = { x: 0, y: 0 }
        it('fails on flagged cells', () => {
            const newBoard = update(coordinate, assoc('flagged', true), board)
            expect(() => expose(coordinate, newBoard)).toThrow(
                'Cannot expose flagged cell at'
            )
        })

        it('exposes the specified cell', () => {
            const newBoard = expose(coordinate, board)
            expect(get(coordinate, newBoard).exposed).toBe(true)
        })

        it('exposes the surrounding area if it is a zero', () => {
            const newBoard = expose({ x: 0, y: 4 }, board)
            const coordinatesThatShouldBeExposed = [
                { x: 0, y: 2 },
                { x: 0, y: 3 },
                { x: 0, y: 4 },

                { x: 1, y: 2 },
                { x: 1, y: 3 },
                { x: 1, y: 4 },

                { x: 2, y: 3 },
                { x: 2, y: 4 }
            ]
            forEach(({ exposed }, coordinate) => {
                const shouldBeExposed = includes(
                    coordinate,
                    coordinatesThatShouldBeExposed
                )
                expect(exposed).toBe(shouldBeExposed)
            }, newBoard)
        })
    })

    describe('isExploded', () => {
        it('returns false if no flags are exposed', () => {
            expect(isExploded(board)).toBe(false)
        })

        it('returns true if some flags are exposed', () => {
            expect(isExploded(expose({ x: 0, y: 0 }, board))).toBe(true)
        })
    })
})
