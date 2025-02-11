import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'

import { useAuth } from '@open-condo/next/auth'

import { filterTickets, formatTicketsCount, getSortedListTickets } from './utils'

import { color } from '../../styles'
import { Ticket } from '../Ticket'


const List = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  min-height: 400px;
  width: 25%;
  border-radius: 3px;
  background: ${color.backgroundLightest};
`

const Title = styled.div`
  padding: 13px 10px 17px;
  text-transform: uppercase;
`

const TicketCount = styled.span`
  text-transform: lowercase;
  font-weight: bold;
`

const TicketStatus = styled.span`
  font-weight: 600;
`

const Tickets = styled.div`
  height: 100%;
  padding: 0 5px;
`

const ProjectBoardList = ({ status, tickets, filters }) => {
    const { user } = useAuth()
    const filteredTickets = filterTickets(tickets, filters, user.id)
    const filteredListTickets = getSortedListTickets(filteredTickets, status)
    const allListTickets = getSortedListTickets(tickets, status)

    return (
        <Droppable key={status} droppableId={status}>
            {provided => (
                <List>
                    <Title>
                        <TicketStatus>{status} </TicketStatus>
                        <TicketCount>({formatTicketsCount(allListTickets, filteredListTickets)})</TicketCount>
                    </Title>
                    <Tickets
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {filteredListTickets.map((ticket, index) => (
                            <Ticket key={ticket.id} ticket={ticket} index={index} />
                        ))}
                        {provided.placeholder}
                    </Tickets>
                </List>
            )}
        </Droppable>
    )
}

export default ProjectBoardList
