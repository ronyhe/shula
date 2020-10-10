import { isLeftClicked, isRightClicked } from '../src/mouseButtons'

describe('bit mask parsing', () => {
    it('works as expected for the foreseeable values', () => {
        expectLeft(1)
        expectLeft(5)

        expectRight(2)
        expectRight(6)

        expectBoth(3)
        expectBoth(7)
    })

    function expectLeft(buttons: number) {
        expect(isLeftClicked(buttons)).toBe(true)
        expect(isRightClicked(buttons)).toBe(false)
    }

    function expectRight(buttons: number) {
        expect(isLeftClicked(buttons)).toBe(false)
        expect(isRightClicked(buttons)).toBe(true)
    }

    function expectBoth(buttons: number) {
        expect(isLeftClicked(buttons)).toBe(true)
        expect(isRightClicked(buttons)).toBe(true)
    }
})
