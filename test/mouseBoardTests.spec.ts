import {
    createMouseBoard,
    MouseBoard,
    MouseBoardEvent,
    processEvents
} from '../src/MouseBoard'
import { board as testBoard } from './testBoard'
import { always, assoc, curry, evolve, F, T } from 'ramda'
import { expose, toggleFlag } from '../src/Board'

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

    describe.skip('basic mouse ops', () => {
        const coordinate = { x: 0, y: 0 }

        it('toggles flags in right key down', () => {
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
            const expo = curry(expose)

            eventsTest(
                [coordinate, 'upLeft'],
                evolve({
                    pointer: always(coordinate),
                    left: F,
                    board: expo(coordinate)
                })
            )
        })
    })
})
