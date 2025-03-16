import { useEffect } from 'react'

import { KeyCodes } from '../constants'

type UseOnEscapeKeyDownProps = {
    isListening: boolean
    onEscapeKeyDown: () => void
}

const useOnEscapeKeyDown = ({ isListening, onEscapeKeyDown }: UseOnEscapeKeyDownProps): void => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.keyCode === KeyCodes.ESCAPE) { 
                onEscapeKeyDown()
            }
        }

        if (isListening) {
            document.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isListening, onEscapeKeyDown])
}

export default useOnEscapeKeyDown
