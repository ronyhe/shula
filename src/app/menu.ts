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

export { Menu, MenuItem }
