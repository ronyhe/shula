import { createBoard } from '../src/Board'
import { height, width } from '../src/Grid'

describe('createBoard', () => {
    const minePositions = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 2 }
    ]
    const board = createBoard(3, 3, minePositions)

    it('has the correct dimensions', () => {
        expect(height(board)).toBe(3)
        expect(width(board)).toBe(3)
    })

    it('has mines in a all the specified positions, and only in those positions', () => {})
})
