import React from 'react'

import { IssuePriority } from '../../constants'
import { ArrowUp, ArrowDown } from '../../icons'
import { issuePriorityColors } from '../../styles'

interface IProps  {
    priority: number
    size: 'large' | 'medium' | 'small' | 'auto'
}

const TicketPriorityIcon: React.FC<IProps> = ({ priority, size, ...otherProps }) => {
    const IconComponent = [IssuePriority.LOW, IssuePriority.LOWEST].includes(priority)
        ? ArrowDown
        : ArrowUp

    const props = {
        size,
        color: issuePriorityColors[priority],
    }

    return <IconComponent {...props} {...otherProps} />
}

export default TicketPriorityIcon