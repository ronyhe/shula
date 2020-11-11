import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from '../comps/App'
import { getMediaStream, Video } from './Video'

const params = new URLSearchParams(window.location.search)
const mediaSourceId = params.get('mediaSourceId')
if (mediaSourceId === null) {
    throw new Error('MediaSourceId was not passed to the renderer process')
}
const initialGameType = params.get('gameType') ?? 'expert'
const isMac = params.get('isMac') === 'true'

getMediaStream(mediaSourceId)
    .then(stream => new Video(stream))
    .then(video => {
        ReactDOM.render(
            <App
                initialGameType={initialGameType}
                isMac={isMac}
                video={video}
            />,
            document.getElementById('root')
        )
    })
    .catch(error => {
        console.error(error)
        ReactDOM.render(
            <div>{`Cannot start app, error occured: ${error.message}`}</div>,
            document.getElementById('root')
        )
    })
