import React, { Fragment, useState } from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'

import { TicketPriority, TicketPriorityCopy } from '../../../constants'
import { color, font } from '../../../styles'
import { Select, TicketPriorityIcon, Spinner } from '../../../ui'
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

const Label = styled.div`
padding: 0 3px 0 3px;
${font.size(14.5)}
`

const SelectCont = styled.div`
width: 100;
display: flex;
flex-direction:row;
align-items:center;
gap: 5px;
`

const ProjectBoardIssueDetailsPriority = ({ ticket, updateTicket }) => {
    const intl = useIntl()
    const PriorityTitle = intl.formatMessage({ id: 'kanban.ticket.priority.title' })
    const [loading, setLoading] = useState(false)

    const handleUpdatePriority = async (updatedPriority) => {
        setLoading(true)
        await updateTicket({ order: updatedPriority })
        setLoading(false)
    }

    return ( 
        <Fragment>
            <SectionTitle>{PriorityTitle}</SectionTitle>
            <SelectCont>
                <Select
                    variant='empty'
                    withClearValue={false}
                    dropdownWidth={250}
                    name='priority'
                    value={ticket.order || 1}
                    options={Object.values(TicketPriority).map(priority => ({
                        value: priority,
                        label: TicketPriorityCopy[priority],
                    }))}
                    onChange={priority => handleUpdatePriority(priority)}
                    renderValue={({ value: priority }) => renderPriorityItem(priority, true)}
                    renderOption={({ value: priority }) => renderPriorityItem(priority, false)}
                />
                {loading && <Spinner size={20}/> }
            </SelectCont>
        </Fragment>
    )
}

const renderPriorityItem = (priority, isValue) => (
    <Priority $isvalue={isValue}>
        <TicketPriorityIcon priority={priority} size='large' />
        <Label>{TicketPriorityCopy[priority]}</Label>
    </Priority>
)


export default ProjectBoardIssueDetailsPriority
