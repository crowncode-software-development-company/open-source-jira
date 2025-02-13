import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { color, font } from '../../../styles'
import { formatDateTimeConversational } from '../../../utils'


const Dates = styled.div`
  margin-top: 11px;
  padding-top: 13px;
  line-height: 22px;
  border-top: 1px solid ${color.borderLightest};
  color: ${color.textMedium};
  ${font.size(13)}
`

const ProjectBoardIssueDetailsDates = ({ ticket }) => {
    const intl = useIntl()
    const CreatedAtTitle = intl.formatMessage({ id: 'kanban.ticket.createdAt.title' })
    const UpdatedAtTitle = intl.formatMessage({ id: 'kanban.ticket.updatedAt.title' })
    return (<Dates>
        <div>{CreatedAtTitle} {formatDateTimeConversational(ticket.createdAt)}</div>
        <div>{UpdatedAtTitle} {formatDateTimeConversational(ticket.updatedAt)}</div>
    </Dates>)
}

export default ProjectBoardIssueDetailsDates
