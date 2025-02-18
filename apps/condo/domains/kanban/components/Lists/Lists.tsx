import { UUID } from 'crypto'

import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { isPositionChanged } from './utils'

import { useNotificationMessages } from '../../../common/hooks/useNotificationMessages'
import { runMutation } from '../../../common/utils/mutations.utils'
import { Ticket } from '../../../ticket/utils/clientSchema'
import { DeferredUntilModal } from '../DeferredUntilModal/DeferredUntilModal'
import { List } from '../List'

const Lists = styled.div`
  display: flex;
  gap: 5px;
`

type UpdateData = {
    status: {
        connect: {
            id: UUID
        }
    }
    deferredUntil?: string
}

const ProjectBoardLists = ({ tickets, filters, refetchAllTickets, ticketStatuses }) => {
    const intl = useIntl()
    const DefferedStatusTitle = intl.formatMessage({ id: 'ticket.status.DEFERRED.name' })
    const ErrorTitle = intl.formatMessage({ id: 'ErrorOccurred' })
    const { getSuccessfulChangeNotification } = useNotificationMessages()
    const [localTickets, setLocalTickets] = useState(tickets)
    const [deferredUntil, setDeferredUntil] = useState(dayjs())
    const [isOpenUntil, setOpenUntil] = useState(false)
    const [currentDraggableTicketId, setCurrentDraggableTicketId] = useState('')

    useEffect(() => {
        setLocalTickets(tickets)
    }, [tickets])
    
    const update = Ticket.useUpdate({})
    
    const updateTicketStatus = (newType, id, deferUntil?) => {
        const statusObject = {
            connect: { id: ticketStatuses[newType].id },
        }
    
        const updateData: UpdateData = { status: statusObject }
    
        if (deferUntil) {
            updateData.deferredUntil = deferUntil
        }
        
        runMutation({
            action:() => update(updateData, tickets.find((ticket) => ticket.id === id)),
            intl,
            OnCompletedMsg: getSuccessfulChangeNotification,
            onCompleted: () => {refetchAllTickets(), setCurrentDraggableTicketId(''), setDeferredUntil(dayjs())},
            onError: () => setLocalTickets(tickets),
            OnErrorMsg: ErrorTitle,
        })
    }
    
    const handleTicketDrop = ({ draggableId, destination, source }) => {
        if (!destination || !isPositionChanged(source, destination)) return
        setLocalTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === draggableId ? { ...ticket, status: { ...ticket.status, name: destination.droppableId } } : ticket
            )
        )
        if (destination.droppableId === DefferedStatusTitle) {
            setCurrentDraggableTicketId(draggableId)
            setOpenUntil(true)
        }
        else {
            updateTicketStatus(destination.droppableId, draggableId)
        }  
    }

    const handleUntilClose = () => {
        setCurrentDraggableTicketId('')
        setLocalTickets(tickets)
        setOpenUntil(false)
    }

    const handleUntilDateChange = () => {
        updateTicketStatus(DefferedStatusTitle, currentDraggableTicketId, deferredUntil )
        setOpenUntil(false)
    }

    return (
        <>
            <DeferredUntilModal isOpen={isOpenUntil} value={deferredUntil} setValue={setDeferredUntil} onCancel={handleUntilClose} onOk={handleUntilDateChange} />
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
        </>
    )
}
export default ProjectBoardLists
