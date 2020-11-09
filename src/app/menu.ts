interface KeyCombo {
    readonly text: string
    readonly ctrlOrCmd: boolean
}

interface MenuItem {
    readonly displayName: string
    readonly keyCombo: KeyCombo | null
    handler(): void
}

type Menu = ReadonlyArray<MenuItem>

function fitsCombo(
    isMac: boolean,
    e: KeyboardEvent,
    keyCombo: KeyCombo
): boolean {
    const modifierActive = isMac ? e.metaKey : e.ctrlKey
    const modifierSatisfied = keyCombo.ctrlOrCmd ? modifierActive : true
    return e.key === keyCombo.text && modifierSatisfied
}

function registerKeyCombos(
    isMac: boolean,
    menu: Menu,
    extraAction: () => void
): () => void {
    const cb = (e: KeyboardEvent) => {
        menu.forEach(item => {
            if (item.keyCombo && fitsCombo(isMac, e, item.keyCombo)) {
                item.handler()
                extraAction()
            }
        })
    }
    document.addEventListener('keydown', cb)
    return () => document.removeEventListener('keydown', cb)
}

export { Menu, MenuItem, registerKeyCombos }
