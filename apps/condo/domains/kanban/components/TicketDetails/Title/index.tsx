import { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { KeyCodes } from '../../../constants'
import { color, font } from '../../../styles'
import { Textarea } from '../../../ui'

const TitleTextarea = styled(Textarea)`
  margin: 18px 0 0 -12px;
  height: 44px;
  width: 100%;
  textarea {
    padding: 7px 7px 8px;
    line-height: 1.28;
    border: none;
    resize: none;
    background: #fff;
    box-shadow: 0 0 0 1px transparent;
    transition: background 0.1s;
    ${font.size(24)}
    &:hover:not(:focus) {
      background: ${color.backgroundLight};
    }
  }
`

const ProjectBoardIssueDetailsTitle = ({ ticket, updateTicket }) => {
    const intl = useIntl()
    const TicketTitle = intl.formatMessage({ id: 'Ticket' })
    const PlaceholderTitle = intl.formatMessage({ id: 'kanban.ticket.title' })
    const [title, setTitle] = useState(ticket.meta?.title || `${TicketTitle} №${ticket.number} / ${ticket.classifier.category.name} 🠖 ${ticket.classifier.place.name}`)
    const [editing, setEditing] = useState(false)

    const handleTitleChange = () => {
        if (title === ticket.meta.title) return
        setEditing(true)
        updateTicket({ meta: { ...ticket.meta, title } })
        setEditing(false)
    }

    return (
        <TitleTextarea
            maxLenth = {70}
            minRows={1}
            placeholder={PlaceholderTitle}
            disabled={editing}
            value={title}
            onChange={setTitle}
            onBlur={handleTitleChange}
            onKeyDown={event => {
                if (event.keyCode === KeyCodes.ENTER) {
                    (event.target as HTMLTextAreaElement).blur() 
                }
            }}
        />
    )
}

export default ProjectBoardIssueDetailsTitle
