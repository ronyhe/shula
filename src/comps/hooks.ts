import * as React from 'react'
import { useEffect } from 'react'
import { ipcRenderer } from 'electron'

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

function useRendererCallback<A>(
    eventName: string,
    callback: (a: A) => void
): void {
    useEffect(() => {
        const cb = (_e: unknown, arg: A) => callback(arg)
        ipcRenderer.on(eventName, cb)
        return () => {
            ipcRenderer.off(eventName, cb)
        }
    }, [])
}

export { ResourceState, useResource, useRendererCallback }
