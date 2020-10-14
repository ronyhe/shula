import * as React from 'react'
import { Coordinate } from './Grid'
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

function extraClassForCell(cell: MouseCell): string {
    if (cell.flagged) {
        return 'flagged'
    }
    if (!cell.exposed && cell.indent) {
        return 'indent'
    }
    if (cell.exposed) {
        if (cell.isMine) {
            return 'mine'
        }
        return `exposed${cell.adjacentMines}`
    }
    return 'unexposed'
}

function getCssClassesForCell(cell: MouseCell): ReadonlyArray<string> {
    return ['board-cell', extraClassForCell(cell)]
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
        />
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
