interface Key {
    readonly char: string
    readonly ctrlOrCmd: boolean
}

interface MenuItem {
    readonly displayName: string
    readonly key: Key
    handler(): void
}

type Menu = ReadonlyArray<MenuItem>

function respond(isMac: boolean, e: KeyboardEvent, { key, handler }: MenuItem) {
    const modifier = isMac ? e.metaKey : e.ctrlKey
    const modifierSatisfied = key.ctrlOrCmd ? modifier : false
    if (e.key === key.char && modifierSatisfied) {
        handler()
    }
}

function registerKeyListeners(isMac: boolean, menu: Menu): () => void {
    const cb = (e: KeyboardEvent) => {
        menu.forEach(item => respond(isMac, e, item))
    }
    document.addEventListener('keyup', cb)
    return () => {
        document.removeEventListener('keyup', cb)
    }
}

export { Menu, MenuItem, registerKeyListeners }
