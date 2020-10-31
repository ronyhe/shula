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
            throw new Error('Cannot stop un- started video')
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

export { Video }
