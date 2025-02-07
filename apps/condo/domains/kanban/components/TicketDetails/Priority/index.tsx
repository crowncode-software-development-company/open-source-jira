import React, { Fragment } from 'react'
import styled, { css } from 'styled-components'

import { IssuePriority, IssuePriorityCopy } from '../../../constants'
import { color, font } from '../../../styles'
import { Select, TicketPriorityIcon } from '../../../ui'

const Priority = styled.div<{ $isvalue?: boolean }>`
display: flex;
align-items: center;
${props =>
        props.$isvalue &&
  css`
    padding: 3px 4px 3px 0px;
    border-radius: 4px;
    &:hover,
    &:focus {
      background: ${color.backgroundLight};
    }
  `}
`

export const Label = styled.div`
padding: 0 3px 0 3px;
${font.size(14.5)}
`

export const SectionTitle = styled.div`
margin: 24px 0 5px;
text-transform: uppercase;
font-weight: bold;
color: ${color.textMedium};
${font.size(12.5)}
`

interface IProps {
    issue: any
    updateIssue: () => void
}

const ProjectBoardIssueDetailsPriority: React.FC<IProps> = ({ issue, updateIssue }) => (
    <Fragment>
        <SectionTitle>Priority</SectionTitle>
        <Select
            variant='empty'
            withClearValue={false}
            dropdownWidth={343}
            name='priority'
            value={issue.priority}
            options={Object.values(IssuePriority).map(priority => ({
                value: priority,
                label: IssuePriorityCopy[priority],
            }))}
            onChange={priority => updateIssue()}
            renderValue={({ value: priority }) => renderPriorityItem(priority, true)}
            renderOption={({ value: priority }) => renderPriorityItem(priority, false)}
        />
    </Fragment>
)

const renderPriorityItem = (priority, isValue) => (
    <Priority $isvalue={isValue}>
        <TicketPriorityIcon priority={priority} size='large' />
        <Label>{IssuePriorityCopy[priority]}</Label>
    </Priority>
)


export default ProjectBoardIssueDetailsPriority
