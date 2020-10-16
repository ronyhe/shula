import * as React from 'react'
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import {
    getStandardBoardDescriptionFromString,
    StandardDescriptions
} from './boardCreations'
import { InitBoardComp } from './InitBoardComp'

const App: React.FunctionComponent = () => {
    const [description, setDescription] = useState(StandardDescriptions.expert)

    useEffect(() => {
        const cb = (_e: unknown, gameType: string) =>
            setDescription(getStandardBoardDescriptionFromString(gameType))
        ipcRenderer.on('gameType', cb)
        return () => {
            ipcRenderer.off('gameType', cb)
        }
    }, [])

    const { width, height, mines } = description
    return <InitBoardComp width={width} height={height} mines={mines} />
}

export default App
