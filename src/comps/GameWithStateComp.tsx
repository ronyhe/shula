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
import { useEventTarget } from './hooks'

interface GameResult {
    readonly solved: boolean
    readonly elapsedTimeMillis: number
}

interface GameWithStateCompProps {
    readonly initialGameType: string
    readonly isMac: boolean
    readonly appEvents: EventTarget
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
    appEvents
}) => {
    const [compState, setCompState] = React.useState<CompState>(() => ({
        startTime: 0,
        gameState: resetStateToGameType(initialGameType)
    }))
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

    useEventTarget<string>(appEvents, 'gameType', gameType =>
        setState(() => resetStateToGameType(gameType))
    )

    useEventTarget<void>(appEvents, 'newGame', () =>
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
        <GameComp
            state={gameState}
            onEvent={onEvent}
            onClickSmiley={onClickSmiley}
        />
    )
}

export { GameWithStateCompProps, GameWithStateComp, GameResult }
