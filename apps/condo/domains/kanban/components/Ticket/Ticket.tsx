import { useRouter } from 'next/router'
import { Draggable } from 'react-beautiful-dnd'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'

import { color, font, mixin } from '../../styles'
import { Avatar, TicketPriorityIcon, TicketTypeIcon } from '../../ui'
import { formatDefferedDate } from '../../utils'

const TicketLink = styled.div`
  display: block;
  margin-bottom: 5px;
`
interface TicketProps {
    isbeingdragged: string | undefined
}

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`

const Ticket = styled.div<TicketProps>`
  padding: 10px 10px 7px 10px;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0px 1px 2px 0px rgba(9, 30, 66, 0.25);
  transition: background 0.1s;
  ${mixin.clickable}
  @media (max-width: 1100px) {
    padding: 10px 8px;
  }
  &:hover {
    background: ${color.backgroundLight};
  }
  ${props =>
        props.isbeingdragged &&
    css`
      transform: rotate(3deg);
      box-shadow: 5px 10px 30px 0px rgba(9, 30, 66, 0.15);
    `}
`

const Title = styled.p`
  padding: 0;
`

const AssigneeAvatar = styled(Avatar)`
margin-left: -12px;
`
const NumberTicket = styled.span`
font-weight: 600;
`
const Icons = styled.span`
 display: flex;
 align-items: center;
`

const Assignees = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-left: 2px;
`

const BeforeText = styled.div`
background-color: ${color.backgroundLightest};
border-radius: 7px;
padding: 0 5px;
color: ${color.textDark};
${font.size(12)}
`

const ProjectBoardListTicket = ({ ticket, index }) => {
    const intl = useIntl()
    const BeforeTitle = intl.formatMessage({ id: 'kanban.ticket.tickets.before' })
    const router = useRouter()
    const handleOpenModal = () => {
        router.push(`?ticketId=${ticket.id}`, undefined, { shallow: true })
    }
    return (
        <Draggable draggableId={ticket.id.toString()} index={index}>
            {(provided, snapshot) => (
                <TicketLink
                    onClick={handleOpenModal}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <Ticket isbeingdragged={snapshot.isDragging && !snapshot.isDropAnimating ? 'true' : undefined}>
                        <Title><NumberTicket>№{ticket.number}</NumberTicket> / {ticket.classifier.category.name} 🠖 {ticket.classifier.place.name}</Title>
                        <Bottom>
                            <Icons>
                                <TicketTypeIcon type='task' size='medium'/>
                                <TicketPriorityIcon priority={ticket.order || 1} size='medium'/>
                                {ticket.deferredUntil && <BeforeText>{formatDefferedDate(BeforeTitle, ticket.deferredUntil)}</BeforeText>}
                            </Icons>
                            <Assignees>
                                <AssigneeAvatar
                                    size={24}
                                    name={ticket.assignee.name}
                                />
                                <AssigneeAvatar
                                    size={24}
                                    name={ticket.executor.name}
                                />
                            </Assignees>
                        </Bottom>
                    </Ticket>
                </TicketLink>
            )}
        </Draggable>
    )
}

export default ProjectBoardListTicket
