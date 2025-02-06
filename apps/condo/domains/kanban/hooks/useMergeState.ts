import { isFunction } from 'lodash'
import { useState, useCallback } from 'react'

const useMergeState = initialState => {
    const [state, setState] = useState(initialState || {})

    const mergeState = useCallback(newState => {
        if (isFunction(newState)) {
            setState(currentState => ({ ...currentState, ...newState(currentState) }))
        } else {
            setState(currentState => ({ ...currentState, ...newState }))
        }
    }, [])

    return [state, mergeState]
}

export default useMergeState
