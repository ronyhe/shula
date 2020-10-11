import * as React from 'react'
import { Board, Cell } from './Board'
import { Coordinate } from './Grid'
import { Consumer } from './utils'
import { append } from 'ramda'

type CoordinateCallback = Consumer<Coordinate>

interface BoardCompProps {
    readonly board: Board<Cell>
    readonly onExpose: CoordinateCallback
    readonly onFlag: CoordinateCallback
}

interface CreateCellParams {
    readonly cell: Cell
    readonly coordinate: Coordinate
    readonly onExpose: CoordinateCallback
    readonly onFlag: CoordinateCallback
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

function getCssClassesForCell(cell: Cell): ReadonlyArray<string> {
    const base = ['board-cell']
    if (cell.exposed) {
        return append('exposed', base)
    } else {
        return base
    }
}

function getCssClassesForCellAsString(cell: Cell): string {
    return getCssClassesForCell(cell).join(' ')
}

function createCell({
    cell,
    coordinate,
    onExpose,
    onFlag
}: CreateCellParams): React.ReactFragment {
    return (
        <td
            className={getCssClassesForCellAsString(cell)}
            key={JSON.stringify(coordinate)}
            onContextMenu={e => {
                e.preventDefault()
                onFlag(coordinate)
            }}
            onClick={() => onExpose(coordinate)}
        >
            {cellContent(cell)}
        </td>
    )
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
                        {row.map((cell, cellIndex) => {
                            const coordinate = { x: cellIndex, y: rowIndex }
                            return createCell({
                                cell,
                                coordinate,
                                onExpose,
                                onFlag
                            })
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export { BoardComp, BoardCompProps }
