import {
    createMouseBoard,
    MouseBoard,
    MouseBoardEvent,
    processEvent,
    processEvents
} from '../src/MouseBoard'
import { board as testBoard } from './testBoard'
import { always, assoc, curry, evolve, T } from 'ramda'
import { expose, toggleFlag } from '../src/Board'
import { get, getNeighborCoordinates } from '../src/Grid'

const board = createMouseBoard(testBoard)

function eventsTest(
    events: ReadonlyArray<MouseBoardEvent>,
    createExpected: (b: MouseBoard) => MouseBoard
): void {
    expect(processEvents(board, events)).toEqual(createExpected(board))
}

describe('mouse events', () => {
    describe('simple state changes, regardless of indentation', () => {
        it('clicks buttons', () => {
            eventsTest(['downLeft'], assoc('left', true))

            eventsTest(['downRight'], assoc('right', true))
        })

        it('un-clicks buttons', () => {
            eventsTest(['downLeft', 'upLeft'], assoc('left', false))

            eventsTest(['downRight', 'upRight'], assoc('right', false))
        })

        it('enters and leaves coordinates', () => {
            const coordinate = { x: 0, y: 0 }
            eventsTest([coordinate], assoc('pointer', coordinate))

            eventsTest([coordinate, 'leave'], assoc('pointer', null))
        })
    })

    describe('basic mouse ops', () => {
        it('toggles flags on right key down', () => {
            const coordinate = { x: 0, y: 0 }
            const toggle = curry(toggleFlag)

            eventsTest(
                [coordinate, 'downRight'],
                evolve({
                    pointer: always(coordinate),
                    right: T,
                    board: toggle(coordinate)
                })
            )
        })

        it('exposes on left key up', () => {
            const coordinate = { x: 1, y: 0 }
            const exposed = {
                ...board,
                board: expose(coordinate, board.board)
            }
            const processed = processEvent(exposed, 'upLeft')
            const cell = get(coordinate, processed.board)
            expect(cell.exposed).toBe(true)
        })
    })

    describe('indentation', () => {
        it('indents exposed cells', () => {
            const coordinate = { x: 1, y: 0 }
            const exposed = {
                ...board,
                board: expose(coordinate, board.board)
            }
            const processed = processEvent(exposed, 'reset')
            const cell = get(coordinate, processed.board)
            expect(cell.indent).toBe(true)
        })

        it('indents unexposed cell under mouse pointer when left key is down', () => {
            const coordinate = { x: 0, y: 0 }
            const processed = processEvents(board, [coordinate, 'downLeft'])
            expect(processed.left).toBe(true)
            const cell = get(coordinate, processed.board)
            expect(cell.indent).toBe(true)
        })

        it('indents unexposed cell under mouse pointer when left key is down, even when the key was already down', () => {
            const coordinate = { x: 0, y: 0 }
            const processed = processEvents(board, ['downLeft', coordinate])
            expect(processed.left).toBe(true)
            const cell = get(coordinate, processed.board)
            expect(cell.indent).toBe(true)
        })

        it('indents unexposed cells under mouse pointer when left key moves', () => {
            const coordinates = [
                { x: 0, y: 0 },
                { x: 1, y: 1 }
            ]

            const processed1 = processEvents(board, [
                'downLeft',
                coordinates[0]
            ])
            expect(processed1.left).toBe(true)
            const cell1 = get(coordinates[0], processed1.board)
            expect(cell1.indent).toBe(true)

            const processed2 = processEvent(processed1, coordinates[1])
            expect(processed2.left).toBe(true)
            const cell2 = get(coordinates[1], processed2.board)
            expect(cell2.indent).toBe(true)
        })

        it.skip('indents neighbors when both keys are down, if the cell is exposed', () => {
            const coordinate = { x: 2, y: 0 }
            const exposed = {
                ...board,
                board: expose(coordinate, board.board)
            }
            const processed = processEvents(exposed, [
                coordinate,
                'downLeft',
                'downRight'
            ])
            const expectedIndentations = getNeighborCoordinates(
                coordinate,
                processed.board
            )
            expectedIndentations.forEach(c => {
                const cell = get(c, processed.board)
                expect(cell.indent).toBe(true)
            })
        })
    })
})
