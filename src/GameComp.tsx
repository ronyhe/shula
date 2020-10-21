import * as React from 'react'
import { AppBoardState } from './AppBoardState'
import { MouseBoardEvent } from './MouseBoard'
import { TopBarComp } from './TopBarComp'
import { BoardComp } from './BoardComp'

interface GameCompProps {
    readonly state: AppBoardState
    onEvent(e: MouseBoardEvent): void
    onClickSmiley(): void
}

const GameComp: React.FunctionComponent<GameCompProps> = ({
    state,
    onEvent,
    onClickSmiley
}) => {
    return (
        <div className="game">
            <TopBarComp
                seconds={999}
                smiley={'normal'}
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
