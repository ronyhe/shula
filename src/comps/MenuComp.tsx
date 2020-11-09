import * as React from 'react'
import { Menu, MenuItem, KeyCombo } from '../app/menu'

interface MenuCompProps {
    readonly items: Menu
    readonly isMac: boolean
    readonly show: boolean
    onClose(): void
}

interface MenuItemCompProps {
    readonly item: MenuItem
    readonly isMac: boolean
    onClose(): void
}

function modifierText(isMac: boolean): string {
    if (isMac) {
        return '⌘'
    }
    return 'Ctrl+'
}

function comboText(isMac: boolean, combo: KeyCombo): string {
    const prefix = combo.ctrlOrCmd ? modifierText(isMac) : ''
    return `${prefix}${combo.text.toUpperCase()}`
}

const MenuItemComp: React.FunctionComponent<MenuItemCompProps> = ({
    isMac,
    item,
    onClose
}) => {
    const onClick = () => {
        onClose()
        item.handler()
    }
    const textDiv = item.keyCombo ? (
        <div className="menu-item-key-combo">
            {comboText(isMac, item.keyCombo)}
        </div>
    ) : null
    return (
        <div className="menu-item ripple" onClick={onClick}>
            <div className="menu-item-display-name">{item.displayName}</div>
            {textDiv}
        </div>
    )
}

const MenuComp: React.FunctionComponent<MenuCompProps> = ({
    show,
    items,
    isMac,
    onClose
}) => {
    if (!show) {
        return null
    }
    return (
        <div className="menu" onMouseLeave={onClose}>
            {items.map(item => (
                <MenuItemComp
                    isMac={isMac}
                    item={item}
                    key={item.displayName}
                    onClose={onClose}
                />
            ))}
        </div>
    )
}

export { MenuItemCompProps, MenuComp }
