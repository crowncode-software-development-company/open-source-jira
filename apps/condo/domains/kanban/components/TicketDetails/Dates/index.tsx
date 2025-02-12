import React from 'react'
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

const ProjectBoardIssueDetailsDates = ({ ticket }) => (
    <Dates>
        <div>Created at {formatDateTimeConversational(ticket.createdAt)}</div>
        <div>Updated at {formatDateTimeConversational(ticket.updatedAt)}</div>
    </Dates>
)

export default ProjectBoardIssueDetailsDates
