import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'

import { formatTicketsCount, getSortedListTickets } from './utils'

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
    // const filteredIssues = filterIssues(tickets, filters, currentUserId, intl)
    const filteredListTickets = getSortedListTickets(tickets, status)
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
