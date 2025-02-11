import React from 'react'

import { BugIcon, StoryIcon, TaskIcon } from '../../icons'

interface IProps {
    type: string
    size: 'large' | 'medium' | 'small' | 'auto'
}

const TicketTypeIcon: React.FC<IProps> = ({ type, size,  ...otherProps }) => {
    const iconMap = {
        'task': TaskIcon,
        'bug': BugIcon,
        'story': StoryIcon,
    }

    const IconComponent = iconMap[type] 

    const props = {
        size,
    }

    return <IconComponent {...props} { ...otherProps}/>
}

export default TicketTypeIcon
