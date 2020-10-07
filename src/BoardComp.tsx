import * as React from 'react'
import { Board, Cell } from './Board'
import { Coordinate } from './Grid'

interface BoardCompProps {
    readonly board: Board
    onExpose(coordinate: Coordinate): void
    onFlag(coordinate: Coordinate): void
}

function cellContent(cell: Cell): string {
    if (cell.flagged) {
        return 'f'
    }
    if (!cell.exposed) {
        return ' '
    }
    if (cell.isMine) {
        return 'x'
    }
    return cell.adjacentMines.toString()
}

const BoardComp: React.FunctionComponent<BoardCompProps> = ({
    board,
    onExpose,
    onFlag
}) => {
    return (
        <table className="board-table">
            <tbody>
                {board.map((row, rowIndex) => (
                    <tr key={`${rowIndex}`} className="board-row">
                        {row.map((cell, cellIndex) => (
                            <td
                                className="board-cell"
                                key={`${rowIndex}:${cellIndex}`}
                                onContextMenu={e => {
                                    e.preventDefault()
                                    onFlag({
                                        x: cellIndex,
                                        y: rowIndex
                                    })
                                }}
                                onClick={() =>
                                    onExpose({
                                        x: cellIndex,
                                        y: rowIndex
                                    })
                                }
                            >
                                {cellContent(cell)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export { BoardComp, BoardCompProps }
