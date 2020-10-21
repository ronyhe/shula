import { AppBoardState, resetState, updateState } from '../src/AppBoardState'
import { createMouseBoard, MouseBoardEvent } from '../src/MouseBoard'
import { board as testBoard, minePositions } from './testBoard'
import { height, width } from '../src/Grid'
import { reduce, length, assoc, chain } from 'ramda'
import { StandardDescriptions } from '../src/boardCreations'

function processEvents(
    state: AppBoardState,
    events: ReadonlyArray<MouseBoardEvent>
): AppBoardState {
    return reduce(updateState, state, events)
}

describe('appBoardState updates', () => {
    const state: AppBoardState = {
        board: createMouseBoard(testBoard),
        init: false,
        description: {
            width: width(testBoard),
            height: height(testBoard),
            mines: length(minePositions)
        },
        endGame: { solved: false, exploded: false }
    }

    const flagAllMines: ReadonlyArray<MouseBoardEvent> = chain(
        pos => [pos, 'downRight', 'upRight'],
        minePositions
    )

    it('updates the endGame when exploded', () => {
        const exploded = processEvents(assoc('init', true, state), [
            minePositions[0],
            'upLeft'
        ])
        expect(exploded.endGame.exploded).toBe(true)
    })

    it('updates the endGame when solved', () => {
        const solved = processEvents(state, flagAllMines)
        expect(solved.endGame.solved).toBe(true)
    })

    it('does not alter the state of ended games', () => {
        const solved = processEvents(state, flagAllMines)
        const afterSolved = processEvents(solved, [{ x: 2, y: 0 }, 'upLeft'])
        expect(afterSolved).toEqual(solved)
    })

    it('initializes the game on coordinated right clicks', () => {
        expect(processEvents(state, ['downRight']).init).toBe(false)
        expect(processEvents(state, [{ x: 0, y: 0 }, 'downRight']).init).toBe(
            true
        )
    })

    it('replaces the board if the starting move is an explosion', () => {
        expect(
            processEvents(state, [{ x: 0, y: 0 }, 'downLeft']).board
        ).not.toEqual(state.board)
    })

    it('resets a state according to the provided description', () => {
        const reset = resetState('expert')
        expect(reset.description).toBe(StandardDescriptions.expert)
        expect(reset.init).toBe(false)
    })
})
