import * as React from 'react'

import { BoardDescription, createRandomBoard } from './boardCreations'
import { useState } from 'react'
import {
    createMouseBoard,
    MouseBoardEvent,
    processEvent,
    processEvents
} from './MouseBoard'
import { BoardComp, EndGame } from './BoardComp'
import { isExploded, isSolved } from './Board'

const InitBoardComp: React.FunctionComponent<BoardDescription> = ({
    width,
    height,
    mines
}) => {
    const [board, setBoard] = useState(() =>
        createMouseBoard(
            createRandomBoard({ width, height, mines }, { x: -1, y: -1 })
        )
    )
    const [init, setInit] = useState(false)
    const endGame: EndGame = {
        solved: init && isSolved(board.board),
        exploded: init && isExploded(board.board)
    }

    let onEvent: (e: MouseBoardEvent) => void
    if (endGame.exploded || endGame.solved) {
        onEvent = () => null
    } else if (init) {
        onEvent = e => setBoard(processEvent(board, e))
    } else {
        onEvent = e => {
            if (board.pointer && (e === 'upLeft' || e === 'downRight')) {
                const newBoard = createMouseBoard(
                    createRandomBoard({ width, height, mines }, board.pointer)
                )
                const processed = processEvents(newBoard, [board.pointer, e])
                setInit(true)
                setBoard(processed)
            } else {
                setBoard(processEvent(board, e))
            }
        }
    }

    return <BoardComp board={board} endGame={endGame} onEvent={onEvent} />
}

export { InitBoardComp }
