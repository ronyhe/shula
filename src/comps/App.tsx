import * as React from 'react'
import { GameWithStateComp } from './GameWithStateComp'

interface AppParams {
    readonly mediaSourceId: string
}

const App: React.FunctionComponent<AppParams> = () => {
    return (
        <GameWithStateComp
            onInit={() => console.log('init')}
            onFinish={() => console.log('finish')}
        />
    )
}

export default App
