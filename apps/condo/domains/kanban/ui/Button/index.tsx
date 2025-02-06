import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { color, font, mixin } from '../../styles'
import Spinner from '../Spinner'

export const StyledButton = styled.button<{ iconOnly?: boolean, variant: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  vertical-align: middle;
  line-height: 1;
  padding: 0 ${props => (props.iconOnly ? 9 : 12)}px;
  white-space: nowrap;
  border-radius: 3px;
  transition: all 0.1s;
  appearance: none;
  border: none;
  ${mixin.clickable}
  ${font.size(14.5)}
  ${props => buttonVariants[props.variant]}
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`

const colored = css<{ variant: string, isActive?: boolean }>`
  color: #fff;
  background: ${props => color[props.variant]};
  &:not(:disabled) {
    &:hover {
      background: ${props => mixin.lighten(color[props.variant], 0.15)};
    }
    &:active {
      background: ${props => mixin.darken(color[props.variant], 0.1)};
    }
    ${props =>
        props.isActive &&
      css`
        background: ${mixin.darken(color[props.variant], 0.1)} !important;
      `}
  }
`

const secondaryAndEmptyShared = css<{ isActive?: boolean }>`
  color: ${color.textDark};
  &:not(:disabled) {
    &:hover {
      background: ${color.backgroundLight};
    }
    &:active {
      color: ${color.primary};
      background: ${color.backgroundLightPrimary};
    }
    ${props =>
        props.isActive &&
      css`
        color: ${color.primary};
        background: ${color.backgroundLightPrimary} !important;
      `}
  }
`

const buttonVariants = {
    primary: colored,
    success: colored,
    danger: colored,
    secondary: css`
    background: ${color.secondary};
    ${secondaryAndEmptyShared};
  `,
    empty: css`
    background: #fff;
    ${secondaryAndEmptyShared};
  `,
}

export const StyledSpinner = styled(Spinner)`
  position: relative;
  top: 1px;
`

export const Text = styled.div<{ withPadding?: boolean }>`
  padding-left: ${props => (props.withPadding ? 7 : 0)}px;
`

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string
    children?: React.ReactNode
    variant?: 'primary' | 'success' | 'danger' | 'secondary' | 'empty'
    icon?: React.ReactNode
    iconSize?: number
    disabled?: boolean
    isWorking?: boolean
    onClick?: () => void
}

// eslint-disable-next-line react/display-name
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            children,
            variant = 'secondary',
            icon,
            iconSize = 18,
            disabled = false,
            isWorking = false,
            onClick = () => null,
            ...buttonProps
        },
        ref
    ) => {
        const handleClick = () => {
            if (!disabled && !isWorking) {
                onClick()
            }
        }

        return (
            <StyledButton
                {...buttonProps}
                onClick={handleClick}
                variant={variant}
                disabled={disabled || isWorking}
                iconOnly={!children}
                ref={ref}
            >
                {isWorking && <StyledSpinner size={26} color={getIconColor(variant)} />}
                {icon}
                {children && <Text withPadding={isWorking || icon !== undefined}>{children}</Text>}
            </StyledButton>
        )
    },
)

const getIconColor = variant =>
    ['secondary', 'empty'].includes(variant) ? color.textDark : '#fff'

export default Button
