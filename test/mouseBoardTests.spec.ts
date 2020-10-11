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
            eventsTest(assoc('left', false), ['upLeft'])

            eventsTest(assoc('right', false), ['upRight'])
        })
    })
})
