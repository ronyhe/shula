import {
    assoc,
    filter,
    includes,
    prop,
    length,
    take,
    map as ramdaMap,
    range
} from 'ramda'
import {
    Cell,
    createBoard,
    toggleFlag,
    expose,
    isExploded,
    isSolved,
    Board,
    exposeNeighbors,
    repeat
} from '../src/Board'
import {
    height,
    width,
    forEach,
    Coordinate,
    Grid,
    map,
    get,
    update,
    values,
    coordinates,
    valuesAndCoordinates,
    CoordinateValues
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

    describe('toggleFlag', () => {
        const coordinate = { x: 0, y: 0 }

        it('flags for unexposed cells', () => {
            const newBoard = toggleFlag(coordinate, board)
            const cell = get(coordinate, newBoard)
            expect(cell.flagged).toBe(true)
        })

        it('removes flags from flagged cells', () => {
            const newBoard = toggleFlag(
                coordinate,
                toggleFlag(coordinate, board)
            )
            expect(newBoard).toEqual(board)
        })

        it('ignores for exposed cells', () => {
            const newBoard = update(coordinate, assoc('exposed', true), board)
            expect(toggleFlag(coordinate, newBoard)).toEqual(newBoard)
        })
    })

    describe('exposing', () => {
        const coordinate = { x: 0, y: 0 }
        it('ignores for flagged cells', () => {
            const newBoard = update(coordinate, assoc('flagged', true), board)
            expect(expose(coordinate, newBoard)).toEqual(newBoard)
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

    describe('exposeNeighbors', () => {
        describe('ignore scenarios', () => {
            it('ignores for unexposed cells', () => {
                expect(exposeNeighbors({ x: 1, y: 0 }, board)).toEqual(board)
            })

            it('ignores for flagged cells', () => {
                const coordinate = { x: 0, y: 0 }
                const flagged = toggleFlag(coordinate, board)
                expect(exposeNeighbors(coordinate, flagged)).toEqual(flagged)
            })

            it('ignores if not all adjacent mines are flagged', () => {
                const coordinate = { x: 1, y: 0 }
                const partiallyFlagged = toggleFlag({ x: 0, y: 0 }, board)
                expect(exposeNeighbors(coordinate, partiallyFlagged)).toEqual(
                    partiallyFlagged
                )
            })

            it('ignores for mines', () => {
                const coordinate = { x: 0, y: 0 }
                const exposedMine = expose(coordinate, board)
                expect(exposeNeighbors(coordinate, exposedMine)).toEqual(
                    exposedMine
                )
            })
        })

        describe('action scenarios', () => {
            const coordinate = { x: 1, y: 0 }
            const boardWithNumberExposed = expose(coordinate, board)
            const mines = [
                { x: 0, y: 0 },
                { x: 1, y: 1 }
            ]

            it('exposes all unexposed non flagged neighboring cells', () => {
                const flagged = repeat(
                    toggleFlag,
                    mines,
                    boardWithNumberExposed
                )
                const exposed = exposeNeighbors(coordinate, flagged)
                const shouldBeExposed = [
                    { x: 2, y: 0 },
                    { x: 2, y: 1 },
                    { x: 0, y: 1 }
                ]
                expect(isExploded(exposed)).toBe(false)
                shouldBeExposed.forEach(coordinate => {
                    expect(get(coordinate, exposed).exposed).toBe(true)
                })
                mines.forEach(coordinate => {
                    expect(get(coordinate, exposed).flagged).toBe(true)
                })
            })

            it('exposes mines if an incorrect cell is flagged', () => {
                const correctFlag = toggleFlag(mines[0], boardWithNumberExposed)
                const incorrectFlag = toggleFlag({ x: 2, y: 0 }, correctFlag)
                const exposed = exposeNeighbors(coordinate, incorrectFlag)
                expect(isExploded(exposed)).toBe(true)
                range(0, 3).forEach(x => {
                    expect(get({ x, y: 1 }, exposed).exposed).toBe(true)
                })
            })
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

    describe('isSolved', () => {
        describe('incorrect flag amount', () => {
            const mineCount = length(filter(prop('isMine'), values(board)))
            const flagCells: (n: number) => Board = n =>
                repeat(toggleFlag, take(n, coordinates(board)), board)

            it('returns false if a there are more flags than mines', () => {
                expect(isSolved(flagCells(mineCount + 1))).toBe(false)
            })

            it('returns false if there are less flags than mines', () => {
                expect(isSolved(flagCells(mineCount - 1))).toBe(false)
            })
        })

        it('returns false if the board is exploded', () => {
            const exposed = expose({ x: 0, y: 0 }, board)
            expect(isExploded(exposed)).toBe(true)
            expect(isSolved(exposed)).toBe(false)
        })

        it('returns true if exactly the amount of mines is flagged, and each flag is correct', () => {
            const gridValues: CoordinateValues<Cell> = valuesAndCoordinates(
                board
            )
            const mines: CoordinateValues<Cell> = filter(
                c => c.value.isMine,
                gridValues
            )
            const mineCoordinates: ReadonlyArray<Coordinate> = ramdaMap(
                prop('coordinate'),
                mines
            )
            const flaggedBoard = repeat(toggleFlag, mineCoordinates, board)
            expect(isSolved(flaggedBoard)).toBe(true)
        })
    })
})
