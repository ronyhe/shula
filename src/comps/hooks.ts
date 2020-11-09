import * as React from 'react'
import { useEffect } from 'react'

type ResourceState<A> = 'processing' | Error | A

function useResource<A>(fetchResource: () => Promise<A>): ResourceState<A> {
    const [state, setState] = React.useState<ResourceState<A>>('processing')
    useEffect(() => {
        fetchResource()
            .then(v => setState(v))
            .catch(e => setState(e))
    }, [])
    return state
}

function useEventTarget<A>(
    target: EventTarget,
    eventName: string,
    callback: (a: A) => void
): void {
    useEffect(() => {
        const cb = (e: CustomEvent<A>) => callback(e.detail)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        target.addEventListener(eventName, cb)
        return () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            target.removeEventListener(eventName, cb)
        }
    }, [])
}

export { ResourceState, useResource, useEventTarget }
