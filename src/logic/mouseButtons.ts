function isClicked(mask: number, buttons: number): boolean {
    return (mask & buttons) === mask
}

function isLeftClicked(buttons: number): boolean {
    return isClicked(0b01, buttons)
}

function isRightClicked(buttons: number): boolean {
    return isClicked(0b10, buttons)
}

export { isLeftClicked, isRightClicked }
