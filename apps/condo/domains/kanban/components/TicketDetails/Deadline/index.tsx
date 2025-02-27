import { DownOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import React, { CSSProperties, Fragment, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import DatePicker from '../../../../common/components/Pickers/DatePicker'
import { color } from '../../../styles'
import { Spinner } from '../../../ui'
import { SectionTitle } from '../Styles'


export const InputCont = styled.div`
  margin: 0 5px;
  width: 50%;
`

const INPUT_STYLE: CSSProperties = { width: '150px', height: '32px', borderRadius: '5px', backgroundColor: color.backgroundLightest, marginLeft: '-5px' }

const ProjectBoardIssueDetailsDeadline = ({ ticket, updateTicket }) => {
    const intl = useIntl()
    const DeadlineTitle = intl.formatMessage({ id: 'kanban.ticket.deadline.title' })
    const [deadline, setDeadline] = useState(dayjs(ticket.deadline))
    const [loading, setLoading] = useState(false)
    
    const onPeriodChange = async (newDate) => {
        setDeadline(newDate)
        setLoading(true)
        await updateTicket({ deadline: newDate })
        setLoading(false)
    }
    return (
        <>
            <SectionTitle>{DeadlineTitle}</SectionTitle>
            <InputCont>
                <DatePicker
                    style={INPUT_STYLE}
                    value={deadline}
                    onChange={(newDate) => onPeriodChange(newDate)}
                    disabledDate={(date) => date < dayjs()}
                    clearIcon={false}
                    suffixIcon={!loading ? <DownOutlined /> : <Spinner size={16}/>}
                    format='DD.MM.YYYY'
                />
            </InputCont>
        </>
    )
}

export default ProjectBoardIssueDetailsDeadline
