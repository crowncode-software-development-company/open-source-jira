import React from 'react'

import { IconProps, IconWrapper } from './wrappers'

export const BugIcon: React.FC<IconProps> = ({ svgProps: props, ...restProps }) => {
    return (
        <IconWrapper
            icon={
                <svg
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    {...props}
                >
                    <circle 
                        cx='12' 
                        cy='12' 
                        r='10' 
                        fill='#e44d42'
                    />
                    <text 
                        x='12' 
                        y='16' 
                        fontSize='12' 
                        fill='white' 
                        textAnchor='middle' 
                        fontWeight='bold'
                    >
                        !
                    </text>
                </svg>
            }
            {...restProps}
        />
    )
}
