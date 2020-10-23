import * as React from 'react'
import { clamp } from 'ramda'
import { Indent } from './borderComps'

interface CounterCompProps {
    number: number
    className: string
}

const Counter: React.FunctionComponent<CounterCompProps> = ({
    className,
    number
}) => {
    const num = clamp(0, 999, number)
    const str = num.toString().padStart(3, '0').split('')
    return (
        <Indent size="small">
            <div className={`counter ${className}`}>
                {str.map((s, i) => (
                    <div
                        key={i.toString()}
                        className={`counter-digit${s} counter-digit`}
                    />
                ))}
            </div>
        </Indent>
    )
}

export { CounterCompProps, Counter }
