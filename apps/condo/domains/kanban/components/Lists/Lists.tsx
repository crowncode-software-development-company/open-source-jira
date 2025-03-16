import { notification } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { getClientSideSenderInfo } from '@open-condo/codegen/utils/userId'

import { calculateTicketColumnPosition, isPositionChanged } from './utils'

import { useUpdateTicketMutation } from '../../../../gql'
import { DeferredUntilModal } from '../DeferredUntilModal/DeferredUntilModal'
import { List } from '../List'

const Lists = styled.div`
  display: flex;
  min-width: 1200px;
  gap: 5px;
`

const ProjectBoardLists = ({ tickets, filters, refetchAllTickets, ticketStatuses }) => {
    const intl = useIntl()
    const DefferedStatusTitle = intl.formatMessage({ id: 'ticket.status.DEFERRED.name' })
    const [localTickets, setLocalTickets] = useState(tickets)
    const [deferredUntil, setDeferredUntil] = useState(dayjs())
    const [isOpenUntil, setOpenUntil] = useState(false)
    const [currentDraggableTicketId, setCurrentDraggableTicketId] = useState('')
    const [newColumnPosition, setNewColumnPosition] = useState(null)

    useEffect(() => {
        setLocalTickets(tickets)
    }, [tickets])

    const [updateTicket] = useUpdateTicketMutation({
        onCompleted: async () => {
            await refetchAllTickets()
            await  resetState()
        },
        onError: async () => {
            setLocalTickets(tickets),
            notification.error({ message: intl.formatMessage({ id: 'ErrorOccurred' }) })
        },    
    })
        

    const updateTicketStatus = async (newType, id, newListPosition, deferUntil?) => {
        const updatedData = {
            status: { connect: { id: ticketStatuses[newType].id } },
            kanbanOrder: newListPosition,
            ...(deferUntil && { deferredUntil: deferUntil }),
        }

        await updateTicket({
            variables: {
                id,
                data: { 
                    ...updatedData,
                    dv: 1,
                    sender: getClientSideSenderInfo(),
                },
            },
        })
    }

    const resetState = () => {
        setCurrentDraggableTicketId('')
        setDeferredUntil(dayjs())
        setOpenUntil(false)
    }

    const handleTicketDrop = ({ draggableId, destination, source }) => {
        if (!destination || !isPositionChanged(source, destination)) return

        const newListPosition = calculateTicketColumnPosition(localTickets, destination, source, draggableId)
        setNewColumnPosition(newListPosition)

        setLocalTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === draggableId 
                    ? { ...ticket, status: { ...ticket.status, name: destination.droppableId }, kanbanOrder: newListPosition }
                    : ticket
            )
        )

        if (destination.droppableId === DefferedStatusTitle) {
            const ticket = tickets.find(ticket => ticket.id === draggableId)
            if (ticket.status.name === DefferedStatusTitle) {
                updateTicketStatus(DefferedStatusTitle, ticket.id, newListPosition, ticket.deferredUntil)
            } else {
                setCurrentDraggableTicketId(draggableId)
                setOpenUntil(true)
            }
        } else {
            updateTicketStatus(destination.droppableId, draggableId, newListPosition)
        }
    }

    return (
        <>
            <DeferredUntilModal isOpen={isOpenUntil} value={deferredUntil} setValue={setDeferredUntil} onCancel={() => {resetState(); setLocalTickets(tickets)}}
                onOk={() => {
                    updateTicketStatus(DefferedStatusTitle, currentDraggableTicketId, newColumnPosition, deferredUntil)
                    resetState()
                }} />
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
