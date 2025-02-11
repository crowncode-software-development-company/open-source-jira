// @flow 
import { DownOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import dayjs from 'dayjs'
import * as React from 'react'
import { CSSProperties } from 'react'
import styled from 'styled-components'

import DatePicker from '../../../common/components/Pickers/DatePicker'
import { color, font } from '../../styles'

const DateBody = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 15px;
`

const DateText = styled.p`
  font-weigth: 600;
  color: ${color.textMedium};
  ${font.size(18)}
`

const INPUT_STYLE: CSSProperties = { width: '250px', height: '48px', borderRadius: '5px', alignSelf: 'center' }

export const DeferredUntilModal = ({ isOpen, onCancel, onOk, value, setValue }) => {
    return (
        <Modal open={isOpen} closable={true} transitionName='' onCancel={onCancel} onOk={onOk}>
            <DateBody>
                <DateText>До какой даты отложить заявку?</DateText>
                <DatePicker
                    style={INPUT_STYLE}
                    value={value}
                    onChange={(newDate) => setValue(newDate)}
                    disabledDate={(date) => date < dayjs()}
                    clearIcon={false}
                    suffixIcon={<DownOutlined />}
                    format='DD.MM.YYYY'
                />
            </DateBody>
        </Modal>
    )
}