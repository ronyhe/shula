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

export { ResourceState, useResource }
