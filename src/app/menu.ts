interface KeyCombo {
    readonly text: string
    readonly ctrlOrCmd: boolean
}

interface MenuItem {
    readonly displayName: string
    readonly keyCombo: KeyCombo
    handler(): void
}

type Menu = ReadonlyArray<MenuItem>

function respond(
    isMac: boolean,
    e: KeyboardEvent,
    { keyCombo, handler }: MenuItem
) {
    const modifier = isMac ? e.metaKey : e.ctrlKey
    const modifierSatisfied = keyCombo.ctrlOrCmd ? modifier : false
    if (e.key === keyCombo.text && modifierSatisfied) {
        handler()
    }
}

function registerKeyListeners(isMac: boolean, menu: Menu): () => void {
    const cb = (e: KeyboardEvent) => {
        menu.forEach(item => respond(isMac, e, item))
    }
    document.addEventListener('keydown', cb)
    return () => {
        document.removeEventListener('keydown', cb)
    }
}

export { Menu, MenuItem, registerKeyListeners }
