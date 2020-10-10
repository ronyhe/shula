function isLeftClicked(buttons: number): boolean {
    const mask = 0b01
    return (mask & buttons) === mask
}

function isRightClicked(buttons: number): boolean {
    const mask = 0b10
    return (mask & buttons) === mask
}

export { isLeftClicked, isRightClicked }
