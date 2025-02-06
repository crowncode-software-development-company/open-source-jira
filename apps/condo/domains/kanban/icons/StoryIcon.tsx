import React from 'react'

import { IconProps, IconWrapper } from './wrappers'

export const StoryIcon: React.FC<IconProps> = ({ svgProps: props, ...restProps }) => {
    return (
        <IconWrapper
            icon={
                <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    {...props}
                >
                    <path
                        d='M5 21V3H19V21L12 17L5 21Z'
                        fill='currentColor'
                    />
                </svg>
            }
            {...restProps}
        />
    )
}

