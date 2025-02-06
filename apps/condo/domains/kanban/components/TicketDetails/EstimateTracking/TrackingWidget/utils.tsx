import { isNil } from 'lodash'

export const calculateTrackingBarWidth = ({ timeSpent, timeRemaining, estimate }) => {
    if (!timeSpent) {
        return 0
    }
    if (isNil(timeRemaining) && isNil(estimate)) {
        return 100
    }
    if (!isNil(timeRemaining)) {
        return (timeSpent / (timeSpent + timeRemaining)) * 100
    }
    if (!isNil(estimate)) {
        return Math.min((timeSpent / estimate) * 100, 100)
    }
}

export const renderRemainingOrEstimate = ({ timeRemaining, estimate }) => {
    if (isNil(timeRemaining) && isNil(estimate)) {
        return null
    }
    if (!isNil(timeRemaining)) {
        return <div>{`${timeRemaining}h remaining`}</div>
    }
    if (!isNil(estimate)) {
        return <div>{`${estimate}h estimated`}</div>
    }
}