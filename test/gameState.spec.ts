import {
    GameState,
    resetStateToGameType,
    tick,
    updateState
} from '../src/logic/GameState'
import { createMouseBoard, MouseBoardEvent } from '../src/logic/MouseBoard'
import { board as testBoard, minePositions } from './testBoard'
import { height, width } from '../src/logic/Grid'
import { reduce, length, assoc, chain } from 'ramda'
import { StandardDescriptions } from '../src/logic/boardCreations'

function processEvents(
    state: GameState,
    events: ReadonlyArray<MouseBoardEvent>
): GameState {
    return reduce(updateState, state, events)
}

describe('appBoardState updates', () => {
    const state: GameState = {
        board: createMouseBoard(testBoard),
        init: false,
        description: {
            width: width(testBoard),
            height: height(testBoard),
            mines: length(minePositions)
        },
        endGame: { solved: false, exploded: false },
        time: 0
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
        const reset = resetStateToGameType('expert')
        expect(reset.description).toBe(StandardDescriptions.expert)
        expect(reset.init).toBe(false)
    })

    it('does not increment time when not initialized', () => {
        expect(tick(state)).toEqual(state)
    })

    it('increments time when initialized', () => {
        const initState = assoc('init', true, state)
        expect(tick(initState)).toEqual({
            ...initState,
            time: 1
        })
    })
})
