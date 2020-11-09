import * as React from 'react'
import {
    ended,
    GameState,
    resetStateToDescription,
    resetStateToGameType,
    tick,
    updateState
} from '../logic/GameState'
import { useEffect, useLayoutEffect } from 'react'
import { ipcRenderer } from 'electron'
import { MouseBoardEvent } from '../logic/MouseBoard'
import { GameComp } from './GameComp'
import { useRendererCallback } from './hooks'
import { MenuComp } from './MenuComp'

interface GameResult {
    readonly solved: boolean
    readonly elapsedTimeMillis: number
}

interface GameWithStateCompProps {
    readonly initialGameType: string
    readonly isMac: boolean
    onInit(): void
    onFinish(gameResult: GameResult): void
}

function sendSize(): void {
    const root = document.getElementById('root')
    if (!root) {
        return
    }
    const width = root.offsetWidth
    const height = root.offsetHeight
    if (width > 0 && height > 0) {
        ipcRenderer.send('size', width, height)
    }
}

interface CompState {
    readonly gameState: GameState
    readonly startTime: number
}

const GameWithStateComp: React.FunctionComponent<GameWithStateCompProps> = ({
    onInit,
    onFinish,
    initialGameType,
    isMac
}) => {
    const [compState, setCompState] = React.useState<CompState>(() => ({
        startTime: 0,
        gameState: resetStateToGameType(initialGameType)
    }))
    const [showingMenu, setShowingMenu] = React.useState(false)
    const gameState = compState.gameState

    const setState = (f: (s: GameState) => GameState): void => {
        setCompState(({ gameState: oldGameState, startTime }) => {
            const newGameState = f(oldGameState)
            if (!oldGameState.init && newGameState.init) {
                onInit()
                return {
                    gameState: newGameState,
                    startTime: performance.now()
                }
            }
            if (!ended(oldGameState.endGame) && ended(newGameState.endGame)) {
                onFinish({
                    solved: newGameState.endGame.solved,
                    elapsedTimeMillis: performance.now() - startTime
                })
            }
            return {
                gameState: newGameState,
                startTime
            }
        })
    }

    useRendererCallback<string>('gameType', gameType =>
        setState(() => resetStateToGameType(gameType))
    )

    useRendererCallback<void>('newGame', () =>
        setState(s => resetStateToDescription(s, s.description))
    )

    useEffect(() => {
        const timer = setInterval(() => {
            setState(tick)
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    useLayoutEffect(sendSize, [gameState.description])

    const onEvent = (e: MouseBoardEvent): void =>
        setState(s => updateState(s, e))

    const onClickSmiley = () =>
        setState(s => resetStateToDescription(s, s.description))

    return (
        <React.Fragment>
            <div
                className="menu-catch"
                onMouseEnter={() => setShowingMenu(true)}
            />
            <MenuComp
                onClose={() => setShowingMenu(false)}
                show={showingMenu}
                isMac={isMac}
                items={[
                    {
                        displayName: 'option',
                        keyCombo: { text: 'A', ctrlOrCmd: false },
                        handler() {
                            console.log('option click')
                        }
                    }
                ]}
            />
            <GameComp
                state={gameState}
                onEvent={onEvent}
                onClickSmiley={onClickSmiley}
            />
        </React.Fragment>
    )
}

export { GameWithStateCompProps, GameWithStateComp, GameResult }
