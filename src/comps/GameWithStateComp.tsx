import * as React from 'react'
import {
    ended,
    GameState,
    resetStateToDescription,
    resetStateToGameType,
    StartState,
    tick,
    updateState
} from '../logic/GameState'
import { useEffect, useLayoutEffect } from 'react'
import { ipcRenderer } from 'electron'
import { MouseBoardEvent } from '../logic/MouseBoard'
import { GameComp } from './GameComp'

interface GameWithStateCompProps {
    onInit(): void
    onFinish(solved: boolean): void
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

const GameWithStateComp: React.FunctionComponent<GameWithStateCompProps> = ({
    onInit,
    onFinish
}) => {
    const [state, setStateFromReact] = React.useState(StartState)

    const setState = (f: (s: GameState) => GameState): void => {
        setStateFromReact(s => {
            const newState = f(s)
            if (!s.init && newState.init) {
                onInit()
            }
            if (!ended(s.endGame) && ended(newState.endGame)) {
                onFinish(newState.endGame.solved)
            }
            return newState
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

    useLayoutEffect(sendSize, [state.description])

    const onEvent = (e: MouseBoardEvent): void =>
        setState(s => updateState(s, e))

    const onClickSmiley = () =>
        setState(s => resetStateToDescription(s, s.description))

    return (
        <GameComp
            state={state}
            onEvent={onEvent}
            onClickSmiley={onClickSmiley}
        />
    )
}

export { GameWithStateCompProps, GameWithStateComp }
