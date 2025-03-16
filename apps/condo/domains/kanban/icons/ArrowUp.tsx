import React from 'react'

import { IconProps, IconWrapper } from './wrappers'

export const ArrowUp: React.FC<IconProps> = ({ svgProps: props, ...restProps }) => {
    return (
        <IconWrapper
            icon={
                <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    {...props}
                >
                    <path
                        d='M12 18L12 6M12 6L7 11M12 6L17 11'
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

