import { desktopCapturer, remote } from 'electron'
import { head } from 'ramda'
import fs from 'fs'

class Video {
    readonly stream: MediaStream
    mr: MediaRecorder | null

    constructor(stream: MediaStream) {
        this.stream = stream
        this.mr = null
    }

    start(): void {
        if (!this.mr) {
            this.mr = new MediaRecorder(this.stream)
            this.mr.start()
        }
    }

    stop(): Promise<Blob> {
        const { mr, nullifyMr } = this
        if (!mr) {
            throw new Error('Cannot stop un-started video')
        }
        const reset = nullifyMr.bind(this)
        return new Promise<Blob>(resolve => {
            const cb = (e: BlobEvent) => {
                reset()
                mr.removeEventListener('dataavailable', cb)
                resolve(e.data)
            }
            mr.addEventListener('dataavailable', cb)
            mr.stop()
        })
    }

    nullifyMr(): void {
        this.mr = null
    }
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

async function saveFile(data: Blob): Promise<void> {
    const saveDialogReturnValue = await remote.dialog.showSaveDialog({
        title: 'Save Shula Game'
    })
    if (saveDialogReturnValue.filePath) {
        await fs.promises.writeFile(
            saveDialogReturnValue.filePath,
            Buffer.from(await data.arrayBuffer())
        )
    }
}

export { Video, getMediaStream, saveFile }
