import * as React from 'react'
import { Coordinate } from './Grid'
import { MouseBoard, MouseBoardEvent, MouseCell } from './MouseBoard'

interface EndGame {
    readonly exploded: boolean
    readonly solved: boolean
}

interface BoardCompProps {
    readonly board: MouseBoard
    readonly endGame: EndGame
    onEvent(event: MouseBoardEvent): void
}

interface CreateCellParams {
    readonly cell: MouseCell
    readonly coordinate: Coordinate
    readonly endGame: EndGame
    onEvent(event: MouseBoardEvent): void
}

function extraClassExploded(cell: MouseCell) {
    if (cell.isMine) {
        if (cell.exposed) {
            return 'exploded-mine'
        }
        return 'flagged'
    }
    return `exposed${cell.adjacentMines}`
}

function extraClassSolved(cell: MouseCell) {
    if (cell.isMine) {
        return 'flagged'
    }
    return `exposed${cell.adjacentMines}`
}

function extraClassDefault(cell: MouseCell) {
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

function extraClassForCell(cell: MouseCell, endGame: EndGame): string {
    if (endGame.solved) {
        return extraClassSolved(cell)
    }
    if (endGame.exploded) {
        return extraClassExploded(cell)
    }
    return extraClassDefault(cell)
}

function getCssClassesForCell(
    cell: MouseCell,
    endGame: EndGame
): ReadonlyArray<string> {
    return ['board-cell', extraClassForCell(cell, endGame)]
}

function getCssClassesForCellAsString(
    cell: MouseCell,
    endGame: EndGame
): string {
    return getCssClassesForCell(cell, endGame).join(' ')
}

function createCell({
    cell,
    coordinate,
    endGame,
    onEvent
}: CreateCellParams): React.ReactFragment {
    return (
        <td
            className={getCssClassesForCellAsString(cell, endGame)}
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
    endGame,
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
                                endGame,
                                onEvent
                            })
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export { BoardComp, BoardCompProps, EndGame }
