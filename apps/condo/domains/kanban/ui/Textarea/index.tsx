import { Input } from 'antd'
import React from 'react'
import styled, { css } from 'styled-components'

import { color } from '../../styles'

const { TextArea: AntdTextArea } = Input

const StyledTextarea = styled.div<{ invalid?: boolean }>`
  display: inline-block;
  width: 100%;

  .ant-input {
    overflow-y: hidden;
    padding: 8px 12px;
    border-radius: 3px;
    border: 1px solid ${props => (props.invalid ? 'red' : '#d9d9d9')};
    color: ${color.textDarkest};
    background: ${color.backgroundLightest};

    &:focus {
      background: #fff;
      border-color: ${color.borderInputFocus};
      box-shadow: 0 0 0 1px ${color.borderInputFocus};
    }

    ${props =>
        props.invalid &&
      css`
        &,
        &:focus {
          border-color: ${color.danger};
        }`
}
  }`


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string
    invalid?: boolean
    minRows?: number
    onChange: any
}
  
const Textarea: React.FC<TextareaProps> = ({ className, invalid, onChange, ...textareaProps }) => (
    <StyledTextarea className={className} invalid={invalid}>
        <AntdTextArea
            {...textareaProps}
            onChange={e => onChange(e.target.value)} 
            autoSize={{ minRows: textareaProps.minRows || 2 }} 
        />
    </StyledTextarea>
)
  
export default Textarea
