/* eslint-disable react/display-name */
import TextArea from 'antd/lib/input/TextArea'
import React from 'react'
import styled, { css } from 'styled-components'

import { color } from '../../styles'

const StyledTextarea = styled.div<{ $invalid?: boolean }>`
  display: inline-block;
  width: 100%;

  .ant-input {
    overflow-y: hidden;
    padding: 8px 12px;
    border-radius: 3px;
    border: 1px solid ${props => (props.$invalid ? 'red' : '#fff')};
    color: ${color.textDarkest};
    background: #fff;;

    &:focus {
      background: #fff;
      border-color: ${color.borderInputFocus};
      box-shadow: 0 0 0 1px ${color.borderInputFocus};
    }

    ${props =>
        props.$invalid &&
      css`
        &,
        &:focus {
          border-color: ${color.danger};
        }`
}
  }`


interface TextareaProps {
    className?: string
    invalid?: boolean
    onChange: (value: string) => void
    value: string
    [key: string]: any
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ value, className, invalid, onChange, ...textareaProps }, ref) => (
    <StyledTextarea className={className} $invalid={invalid}>
        <TextArea
            ref={ref}
            {...textareaProps}
            value={value}
            onChange={e => onChange(e.target.value)} 
            autoSize={{ minRows: textareaProps.minRows || 2 }} 
        />
    </StyledTextarea>
))

export default Textarea
