import { useEffect } from 'react'

function useEventTarget<A>(
    target: EventTarget,
    eventName: string,
    callback: (a: A) => void
): void {
    useEffect(() => {
        const cb: EventListener = ((e: CustomEvent<A>) =>
            callback(e.detail)) as EventListener
        target.addEventListener(eventName, cb)
        return () => {
            target.removeEventListener(eventName, cb)
        }
    }, [])
}

export { useEventTarget }
