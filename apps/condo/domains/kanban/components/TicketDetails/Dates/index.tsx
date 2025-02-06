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

interface IProps {
    issue: any
}

const ProjectBoardIssueDetailsDates: React.FC<IProps> = ({ issue }) => (
    <Dates>
        <div>Created at {formatDateTimeConversational(issue.createdAt)}</div>
        <div>Updated at {formatDateTimeConversational(issue.updatedAt)}</div>
    </Dates>
)

export default ProjectBoardIssueDetailsDates
