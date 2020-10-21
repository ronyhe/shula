import * as React from 'react'

interface SmileyCompProps {
    readonly mode: 'normal' | 'indent' | 'surprise' | 'sun' | 'dead'
    onClick(): void
}

const SmileyComp: React.FunctionComponent<SmileyCompProps> = ({
    mode,
    onClick
}) => {
    return <div className={`smiley smiley-${mode}`} onClick={onClick} />
}

export { SmileyCompProps, SmileyComp }
