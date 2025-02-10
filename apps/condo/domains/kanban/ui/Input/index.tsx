/* eslint-disable react/display-name */
import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { color, font } from '../../styles'

const StyledInput = styled.div`
  position: relative;
  display: inline-block;
  height: 32px;
  width: 100%;
`

const InputElement = styled.input<{ $hasicon?: boolean, $invalid?: boolean }>`
  height: 100%;
  width: 100%;
  padding: 0 7px;
  border-radius: 3px;
  border: 1px solid ${color.borderLightest};
  color: ${color.textDarkest};
  background: ${color.backgroundLightest};
  transition: background 0.1s;
  ${font.size(15)}
  ${props => props.$hasicon && 'padding-left: 32px;'}
  &:hover {
    background: ${color.backgroundLight};
  }
  &:focus {
    background: #fff;
    border: 1px solid ${color.borderInputFocus};
    box-shadow: 0 0 0 1px ${color.borderInputFocus};
  }
  ${props =>
        props.$invalid &&
    css`
      &,
      &:focus {
        border: 1px solid ${color.danger};
        box-shadow: none;
      }
    `}
`

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string
    value?: string | number
    icon?: string
    invalid?: boolean
    filter?: RegExp
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}


const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            icon,
            className,
            filter,
            onChange = () => null,
            ...inputProps
        },
        ref
    ) => {
        const handleChange = event => {
            if (!filter || filter.test(event.target.value)) {
                onChange(event.target.value)
            }
        }

        return (
            <StyledInput className={className}>
                <InputElement {...inputProps} onChange={handleChange} $hasicon={!!icon} ref={ref} />
            </StyledInput>
        )
    })

export default Input
