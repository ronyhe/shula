import * as React from 'react'

interface IndentProps {
    size: 'small' | 'medium' | 'big'
}

type FrameProps = React.PropsWithChildren<unknown>

const Indent: React.FunctionComponent<IndentProps> = ({ size, children }) => {
    return <div className={`indent-${size}`}>{children}</div>
}

const FullFrame: React.FunctionComponent<FrameProps> = ({ children }) => {
    return (
        <div className="full-frame outer-frame">
            <div className="full-frame inner-frame">{children}</div>
        </div>
    )
}

const TopFrame: React.FunctionComponent<FrameProps> = ({ children }) => {
    return <div className="top-frame">{children}</div>
}

export { IndentProps, FrameProps, Indent, FullFrame, TopFrame }
