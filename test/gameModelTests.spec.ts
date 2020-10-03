import { Cell } from '../src/gameModel'

describe('initial test', () => {
    it('try out', () => {
        const cell: Cell = {
            isMine: true,
            adjacentMines: 8
        }
        console.log(cell)
        expect(1).toBe(1)
    })
})
