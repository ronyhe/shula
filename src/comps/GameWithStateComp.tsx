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

interface GameResult {
    readonly solved: boolean
    readonly elapsedTimeMillis: number
}

interface GameWithStateCompProps {
    readonly initialGameType: string
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
    initialGameType
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

    useEffect(() => {
        const cb = (_e: unknown, gameType: string) =>
            setState(() => resetStateToGameType(gameType))
        ipcRenderer.on('gameType', cb)
        return () => {
            ipcRenderer.off('gameType', cb)
        }
    }, [])

    useEffect(() => {
        const cb = () =>
            setState(s => resetStateToDescription(s, s.description))

        ipcRenderer.on('newGame', cb)
        return () => {
            ipcRenderer.off('newGame', cb)
        }
    }, [])

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
