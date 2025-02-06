import React from 'react'

import { IconProps, IconWrapper } from './wrappers'

export const ArrowDown: React.FC<IconProps> = ({ svgProps: props, ...restProps }) => {
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
                        d='M12 6L12 18M12 18L7 13M12 18L17 13'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            }
            {...restProps}
        />
    )
}

