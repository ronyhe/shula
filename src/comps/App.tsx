import * as React from 'react'
import { GameWithStateComp } from './GameWithStateComp'
import { useResource } from './hooks'
import { head } from 'ramda'
import { desktopCapturer, remote } from 'electron'
import fs from 'fs'
import { Video } from './Video'

interface AppParams {
    readonly mediaSourceId: string
    readonly initialGameType: string
}

async function getMediaStream(mediaSourceId: string): Promise<MediaStream> {
    const sources = await desktopCapturer.getSources({
        types: ['window']
    })
    const source = head(sources.filter(s => s.id === mediaSourceId))
    if (!source) {
        throw new Error(`Cannot find media source ${mediaSourceId}`)
    }
    return await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    })
}

async function saveFile(video: Video): Promise<void> {
    const blob = await video.stop()
    const saveDialogReturnValue = await remote.dialog.showSaveDialog({
        title: 'Save Shula Game'
    })
    if (saveDialogReturnValue.filePath) {
        await fs.promises.writeFile(
            saveDialogReturnValue.filePath,
            Buffer.from(await blob.arrayBuffer())
        )
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
        if (solved) {
            saveFile(video)
                .then(() => console.log('done'))
                .catch(e => console.error(e))
        } else {
            video.stop()
        }
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
