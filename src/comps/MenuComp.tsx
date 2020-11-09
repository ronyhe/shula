import * as React from 'react'
import { Menu, MenuItem } from '../app/menu'

interface MenuCompProps {
    readonly show: boolean
    readonly items: Menu
}

interface MenuItemCompProps {
    readonly item: MenuItem
}

const MenuItemComp: React.FunctionComponent<MenuItemCompProps> = ({ item }) => {
    return (
        <div className="menu-item" onClick={item.handler}>
            {item.displayName}
        </div>
    )
}

const MenuComp: React.FunctionComponent<MenuCompProps> = ({ items, show }) => {
    if (!show) {
        return null
    }
    return (
        <div className="menu">
            {items.map(item => (
                <MenuItemComp item={item} key={item.displayName} />
            ))}
        </div>
    )
}

export { MenuItemCompProps, MenuComp }
