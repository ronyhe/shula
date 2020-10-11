import {
    createMouseBoard,
    MouseBoard,
    MouseBoardEvent,
    processEvents
} from '../src/MouseBoard'
import { board as testBoard } from './testBoard'
import { assoc } from 'ramda'

const board = createMouseBoard(testBoard)

function eventsTest(
    createExpected: (b: MouseBoard) => MouseBoard,
    events: ReadonlyArray<MouseBoardEvent>
): void {
    expect(processEvents(board, events)).toEqual(createExpected(board))
}

describe('mouse events', () => {
    describe('simple state changes, regardless of indentation', () => {
        it('clicks buttons', () => {
            eventsTest(assoc('left', true), ['downLeft'])

            eventsTest(assoc('right', true), ['downRight'])
        })

        it('un-clicks buttons', () => {
            eventsTest(assoc('left', false), ['downLeft', 'upLeft'])

            eventsTest(assoc('right', false), ['downRight', 'upRight'])
        })

        it('enters and leaves coordinates', () => {
            const coordinate = { x: 0, y: 0 }
            eventsTest(assoc('pointer', coordinate), [coordinate])

            eventsTest(assoc('pointer', null), [coordinate, 'leave'])
        })
    })
})
