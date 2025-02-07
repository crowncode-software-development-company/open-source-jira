import { DownOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import React, { CSSProperties, Fragment, useState } from 'react'
import styled from 'styled-components'

import DatePicker from '../../../../common/components/Pickers/DatePicker'
import { color, font } from '../../../styles'


export const InputCont = styled.div`
  margin: 0 5px;
  width: 50%;
`

export const SectionTitle = styled.div`
  margin: 24px 0 15px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${color.textMedium};
  ${font.size(12.5)}
`

const INPUT_STYLE: CSSProperties = { width: '250px', height: '32px', borderRadius: '5px', backgroundColor: color.backgroundLightest, marginLeft: '-5px' }

const ProjectBoardIssueDetailsDeadline = ({ ticket, updateTicket }) => {
    const [deadline, setDeadline] = useState(dayjs(ticket.deadline))

    const onPeriodChange = (newDate) => {
        setDeadline(newDate)
        updateTicket(
            { deadline: newDate }
        )
    }
    return (
        <Fragment>
            <SectionTitle>Deadline</SectionTitle>
            <InputCont>
                <DatePicker
                    style={INPUT_STYLE}
                    value={deadline}
                    onChange={(newDate) => onPeriodChange(newDate)}
                    disabledDate={(date) => date < dayjs()}
                    clearIcon={false}
                    suffixIcon={<DownOutlined />}
                    format='DD.MM.YYYY'
                />
            </InputCont>
        </Fragment>
    )
}

export default ProjectBoardIssueDetailsDeadline
