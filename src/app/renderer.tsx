import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from '../comps/App'

const params = new URLSearchParams(window.location.search)
const mediaSourceId = params.get('mediaSourceId')
if (mediaSourceId === null) {
    throw new Error('MediaSourceId was not passed to the renderer process')
}
const initialGameType = params.get('gameType') ?? 'expert'
const isMac = params.get('isMac') === 'true'

ReactDOM.render(
    <App
        mediaSourceId={mediaSourceId}
        initialGameType={initialGameType}
        isMac={isMac}
    />,
    document.getElementById('root')
)
