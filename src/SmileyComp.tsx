import * as React from 'react'

type SmileyMode = 'normal' | 'indent' | 'surprise' | 'sun' | 'dead'

interface SmileyCompProps {
    readonly mode: SmileyMode
    onClick(): void
}

const SmileyComp: React.FunctionComponent<SmileyCompProps> = ({
    mode,
    onClick
}) => {
    return <div className={`smiley smiley-${mode}`} onClick={onClick} />
}

export { SmileyCompProps, SmileyMode, SmileyComp }
