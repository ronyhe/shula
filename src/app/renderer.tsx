import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from '../comps/App'
import { getMediaStream, Video } from './Video'

function render(comp: JSX.Element): void {
    ReactDOM.render(comp, document.getElementById('root'))
}

const params = new URLSearchParams(window.location.search)
const mediaSourceId = params.get('mediaSourceId')
if (mediaSourceId === null) {
    throw new Error('MediaSourceId was not passed to the renderer process')
}
const initialGameType = params.get('gameType') ?? 'expert'
const isMac = params.get('isMac') === 'true'

async function main() {
    try {
        const stream = await getMediaStream(mediaSourceId as string)
        const video = new Video(stream)
        render(
            <App
                initialGameType={initialGameType}
                isMac={isMac}
                video={video}
            />
        )
    } catch (e) {
        console.error(e)
        render(<div>{`Cannot start app, error occurred: ${e.message}`}</div>)
    }
}

main()
