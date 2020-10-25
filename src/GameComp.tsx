import * as React from 'react'
import { GameState } from './GameState'
import { MouseBoardEvent } from './MouseBoard'
import { TopBarComp } from './TopBarComp'
import { BoardComp } from './BoardComp'
import { SmileyMode } from './SmileyComp'
import { values } from './Grid'
import { filter, prop, length } from 'ramda'
import { FullFrame, Indent, TopFrame } from './borderComps'

interface GameCompProps {
    readonly state: GameState
    onEvent(e: MouseBoardEvent): void
    onClickSmiley(): void
}

function smileyMode(state: GameState): SmileyMode {
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

function mineCount(state: GameState): number {
    const flags = filter(prop('flagged'), values(state.board.board))
    const flagCount = length(flags)
    return state.description.mines - flagCount
}

const GameComp: React.FunctionComponent<GameCompProps> = ({
    state,
    onEvent,
    onClickSmiley
}) => {
    return (
        <FullFrame>
            <div className="game">
                <Indent size="medium">
                    <TopBarComp
                        seconds={state.time}
                        smiley={smileyMode(state)}
                        mines={mineCount(state)}
                        onClick={onClickSmiley}
                    />
                </Indent>
                <TopFrame>
                    <Indent size="big">
                        <BoardComp
                            board={state.board}
                            endGame={state.endGame}
                            onEvent={onEvent}
                        />
                    </Indent>
                </TopFrame>
            </div>
        </FullFrame>
    )
}

export { GameCompProps, GameComp }
