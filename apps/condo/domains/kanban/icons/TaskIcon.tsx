import React from 'react'

import { IconProps, IconWrapper } from './wrappers'

export const TaskIcon: React.FC<IconProps> = ({ svgProps: props, ...restProps }) => {
    return (
        <IconWrapper
            icon={
                <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    {...props}
                >
                    <rect x='2' y='2' width='20' height='20' fill='#2196F3' rx='2' />
                    <path
                        d='M7 12.5 L11 17 L18 7.5'
                        stroke='white'
                        strokeWidth='2.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            }
            {...restProps}
        />
    )
}

