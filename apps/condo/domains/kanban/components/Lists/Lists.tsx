import React, { useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { isPositionChanged } from './utils'

import { useNotificationMessages } from '../../../common/hooks/useNotificationMessages'
import { runMutation } from '../../../common/utils/mutations.utils'
import { Ticket } from '../../../ticket/utils/clientSchema'
import { List } from '../List'

const Lists = styled.div`
  display: flex;
  gap: 5px;
`

const ProjectBoardLists = ({ tickets, filters, refetch, ticketStatuses }) => {
    const intl = useIntl()
    const { getSuccessfulChangeNotification } = useNotificationMessages()
    const [localTickets, setLocalTickets] = useState(tickets)

    useEffect(() => {
        setLocalTickets(tickets)
    }, [tickets])
    
    const update = Ticket.useUpdate({})
    
    const updateTicketStatus = (newType, id) => {
        const statusObject = {
            connect: { id: ticketStatuses[newType].id },
        }

        setLocalTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === id ? { ...ticket, status: { ...ticket.status, name: newType } } : ticket
            )
        )
        
        runMutation({
            action:() => update({ status: statusObject }, tickets.find((ticket) => ticket.id === id)),
            intl,
            OnCompletedMsg: getSuccessfulChangeNotification,
            onCompleted: () => refetch(),
            onError: () => setLocalTickets(tickets),
            OnErrorMsg: 'Ошибка смены статуса',
        })
    }
    
    const handleTicketDrop = ({ draggableId, destination, source }) => {
        if (!destination || !isPositionChanged(source, destination)) return
        updateTicketStatus(destination.droppableId, draggableId)     
    }

    return (
        <DragDropContext onDragEnd={handleTicketDrop}>
            <Lists>
                {Object.keys(ticketStatuses).map((key) => (
                    <List
                        key={key}
                        status={key}
                        tickets={localTickets}
                        filters={filters}
                    />
                ))}
            </Lists>
        </DragDropContext>
    )
}
export default ProjectBoardLists
