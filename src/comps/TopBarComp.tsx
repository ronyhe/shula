import * as React from 'react'
import { SmileyComp, SmileyMode } from './SmileyComp'
import { Counter } from './CounterComp'

interface TopBarCompProps {
    readonly seconds: number
    readonly smiley: SmileyMode
    readonly mines: number
    onClick(): void
}

const TopBarComp: React.FunctionComponent<TopBarCompProps> = ({
    seconds,
    smiley,
    mines,
    onClick
}) => {
    return (
        <div className="top-bar">
            <Counter className="counter-mines" number={mines} />
            <SmileyComp mode={smiley} onClick={onClick} />
            <Counter className="counter-time" number={seconds} />
        </div>
    )
}

export { TopBarCompProps, TopBarComp }
