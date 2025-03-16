import { isEqual } from 'lodash'
import { useRef } from 'react'

const useDeepCompareMemoize = value => {
    const valueRef = useRef()

    if (!isEqual(value, valueRef.current)) {
        valueRef.current = value
    }
    return valueRef.current
}

export default useDeepCompareMemoize
