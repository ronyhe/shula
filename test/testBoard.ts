import { Board, Cell, createBoard } from '../src/Board'
import { Coordinate } from '../src/Grid'

const minePositions: ReadonlyArray<Coordinate> = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 2 }
]

/** A board that's useful for testing.
 *  Most tests rely on its structure, and changing it requires changing those tests.
 *  The adjacent file `./boardCreationTests.spec.ts` tests the board creation function
 *  to make sure the result is the board described here:
 *  x 2 1  The mine has 1 adjacent mine<br />
 *  2 x 2  The mine has 2 adjacent mine<br />
 *  1 2 x  The mine has 1 adjacent mine<br />
 *  0 1 1<br />
 *  0 0 0
 */
const board: Board<Cell> = createBoard(3, 5, minePositions)

export { minePositions, board }
