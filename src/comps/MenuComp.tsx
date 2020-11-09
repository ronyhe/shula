import * as React from 'react'
import { Menu, MenuItem } from '../app/menu'

interface MenuCompProps {
    readonly items: Menu
    readonly isMac: boolean
    readonly show: boolean
    onClose(): void
}

interface MenuItemCompProps {
    readonly item: MenuItem
    onClose(): void
}

const MenuItemComp: React.FunctionComponent<MenuItemCompProps> = ({
    item,
    onClose
}) => {
    const onClick = () => {
        onClose()
        item.handler()
    }
    return (
        <div className="menu-item" onClick={onClick}>
            {item.displayName}
        </div>
    )
}

const MenuComp: React.FunctionComponent<MenuCompProps> = ({
    show,
    items,
    onClose
}) => {
    if (!show) {
        return null
    }
    return (
        <div className="menu" onMouseLeave={onClose}>
            {items.map(item => (
                <MenuItemComp
                    item={item}
                    key={item.displayName}
                    onClose={onClose}
                />
            ))}
        </div>
    )
}

export { MenuItemCompProps, MenuComp }
