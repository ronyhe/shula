import * as React from 'react'
import { Cell } from './Board'
import { Coordinate } from './Grid'
import { append } from 'ramda'
import { MouseBoard, MouseBoardEvent, MouseCell } from './MouseBoard'

interface BoardCompProps {
    readonly board: MouseBoard
    onEvent(event: MouseBoardEvent): void
}

interface CreateCellParams {
    readonly cell: MouseCell
    readonly coordinate: Coordinate
    onEvent(event: MouseBoardEvent): void
}

function cellContent(cell: MouseCell): string {
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

function getCssClassesForCell(cell: MouseCell): ReadonlyArray<string> {
    const base = ['board-cell']
    if (cell.indent) {
        return append('indent', base)
    } else {
        return base
    }
}

function getCssClassesForCellAsString(cell: MouseCell): string {
    return getCssClassesForCell(cell).join(' ')
}

function createCell({
    cell,
    coordinate,
    onEvent
}: CreateCellParams): React.ReactFragment {
    return (
        <td
            className={getCssClassesForCellAsString(cell)}
            key={JSON.stringify(coordinate)}
            onContextMenu={e => {
                e.preventDefault()
            }}
            onMouseEnter={() => onEvent(coordinate)}
            onMouseLeave={() => onEvent('leave')}
            onMouseDown={e => {
                if (e.button === 0) {
                    onEvent('downLeft')
                }
                if (e.button === 2) {
                    onEvent('downRight')
                }
            }}
            onMouseUp={e => {
                if (e.button === 0) {
                    onEvent('upLeft')
                }
                if (e.button === 2) {
                    onEvent('upRight')
                }
            }}
        >
            {cellContent(cell)}
        </td>
    )
}

const BoardComp: React.FunctionComponent<BoardCompProps> = ({
    board,
    onEvent
}) => {
    return (
        <table className="board-table">
            <tbody>
                {board.board.map((row, rowIndex) => (
                    <tr key={`${rowIndex}`} className="board-row">
                        {row.map((cell, cellIndex) => {
                            const coordinate = { x: cellIndex, y: rowIndex }
                            return createCell({
                                cell,
                                coordinate,
                                onEvent
                            })
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export { BoardComp, BoardCompProps }
