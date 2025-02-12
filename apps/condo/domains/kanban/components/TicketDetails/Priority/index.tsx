import React, { Fragment, useState } from 'react'
import styled, { css } from 'styled-components'

import { IssuePriority, IssuePriorityCopy } from '../../../constants'
import { color, font } from '../../../styles'
import { Select, TicketPriorityIcon } from '../../../ui'
import { SectionTitle } from '../Styles'

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

const ProjectBoardIssueDetailsPriority = ({ ticket, updateTicket }) => {
    const handleUpdatePriority = (updatedPriority) => {
        console.log(updatedPriority)
        
        updateTicket({ order: updatedPriority  })
    }

    return ( 
        <Fragment>
            <SectionTitle>Priority</SectionTitle>
            <Select
                variant='empty'
                withClearValue={false}
                dropdownWidth={250}
                name='priority'
                value={ticket.order || 1}
                options={Object.values(IssuePriority).map(priority => ({
                    value: priority,
                    label: IssuePriorityCopy[priority],
                }))}
                onChange={priority => handleUpdatePriority(priority)}
                renderValue={({ value: priority }) => renderPriorityItem(priority, true)}
                renderOption={({ value: priority }) => renderPriorityItem(priority, false)}
            />
        </Fragment>
    )
}

const renderPriorityItem = (priority, isValue) => (
    <Priority $isvalue={isValue}>
        <TicketPriorityIcon priority={priority} size='large' />
        <Label>{IssuePriorityCopy[priority]}</Label>
    </Priority>
)


export default ProjectBoardIssueDetailsPriority
