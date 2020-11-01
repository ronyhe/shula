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

ReactDOM.render(
    <App mediaSourceId={mediaSourceId} initialGameType={initialGameType} />,
    document.getElementById('root')
)
