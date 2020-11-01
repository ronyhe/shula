import * as React from 'react'
import { GameWithStateComp } from './GameWithStateComp'
import { useResource } from './hooks'
import { Video, getMediaStream, saveFile } from '../app/Video'

interface AppParams {
    readonly mediaSourceId: string
    readonly initialGameType: string
}

async function stopVideoAndSaveFile(
    video: Video,
    solved: boolean
): Promise<void> {
    const blob = await video.stop()
    if (solved) {
        await saveFile(blob)
    }
}

const App: React.FunctionComponent<AppParams> = ({
    mediaSourceId,
    initialGameType
}) => {
    const stream = useResource(() => getMediaStream(mediaSourceId))
    if (stream === 'processing') {
        return <div>Loading...</div>
    }
    if (stream instanceof Error) {
        return <div>{`Error: ${stream.message}`}</div>
    }
    const video = new Video(stream)

    const onInit = () => {
        video.start()
    }
    const onFinish = (solved: boolean) => {
        stopVideoAndSaveFile(video, solved).catch(e => {
            console.error(e)
            alert(`Unable to save video: ${e.message}`)
        })
    }
    return (
        <GameWithStateComp
            onInit={onInit}
            onFinish={onFinish}
            initialGameType={initialGameType}
        />
    )
}

export default App
