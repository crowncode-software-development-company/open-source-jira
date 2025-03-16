import React, { useState } from 'react'
import styled from 'styled-components'

import { TicketType, TicketTypeCopy } from '../../../constants'
import { color, font } from '../../../styles'
import { Button, Select, TicketTypeIcon } from '../../../ui'


const TypeButton = styled(Button)`
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${color.textMedium};
  ${font.size(13)}
`

export const Type = styled.div`
  display: flex;
  align-items: center;
`

export const TypeLabel = styled.div`
  padding: 0 5px 0 7px;
  ${font.size(15)}
`

const ProjectBoardIssueDetailsType = ({ ticket, updateTicket }) => {
    const [loading, setLoading] = useState(false)

    const handleUpdateType = async (updatedType) => {
        setLoading(true)
        try {
            await updateTicket({ customClassifier: updatedType })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Select
            variant='empty'
            dropdownWidth={150}
            withClearValue={false}
            name='type'
            value={ticket.customClassifier || 'task'}
            onChange={type => handleUpdateType( type )}
            options={Object.values(TicketType).map(type => ({
                value: type,
                label: TicketTypeCopy[type],
            }))}
            renderValue={({ value: type }) => (
                <TypeButton variant='empty' icon={<TicketTypeIcon type={type || 'task'} size='medium'/>}>
                    {`${TicketTypeCopy[ticket.customClassifier] || 'Task'}-${ticket.number}`}
                </TypeButton>
            )}
            renderOption={({ value: type }) => (
                <Type key={type}>
                    <TicketTypeIcon type={type} size='large'/>
                    <TypeLabel>{TicketTypeCopy[type]}</TypeLabel>
                </Type>
            )}
        />)
}

export default ProjectBoardIssueDetailsType
