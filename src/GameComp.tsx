import * as React from 'react'
import { AppBoardState } from './AppBoardState'
import { MouseBoardEvent } from './MouseBoard'
import { TopBarComp } from './TopBarComp'
import { BoardComp } from './BoardComp'
import { SmileyMode } from './SmileyComp'

interface GameCompProps {
    readonly state: AppBoardState
    onEvent(e: MouseBoardEvent): void
    onClickSmiley(): void
}

function smileyMode(state: AppBoardState): SmileyMode {
    if (state.endGame.exploded) {
        return 'dead'
    }
    if (state.endGame.solved) {
        return 'sun'
    }
    if (state.board.right || state.board.left) {
        return 'surprise'
    }
    return 'normal'
}

const GameComp: React.FunctionComponent<GameCompProps> = ({
    state,
    onEvent,
    onClickSmiley
}) => {
    return (
        <div className="game">
            <TopBarComp
                seconds={state.time}
                smiley={smileyMode(state)}
                mines={999}
                onClick={onClickSmiley}
            />
            <BoardComp
                board={state.board}
                endGame={state.endGame}
                onEvent={onEvent}
            />
        </div>
    )
}

export { GameCompProps, GameComp }
