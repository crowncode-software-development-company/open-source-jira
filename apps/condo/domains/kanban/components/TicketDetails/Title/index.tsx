import { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { KeyCodes } from '../../../constants'
import { color, font } from '../../../styles'
import { Textarea } from '../../../ui'
import { truncateDescription } from '../../../utils'
import { generateErrors, is } from '../../../validation'

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

const ErrorText = styled.div`
  padding-top: 4px;
  color: ${color.danger};
  ${font.size(13)}
`


const ProjectBoardIssueDetailsTitle = ({ ticket, updateTicket }) => {
    const intl = useIntl()
    const TicketTitle = intl.formatMessage({ id: 'Ticket' })
    const PlaceholderTitle = intl.formatMessage({ id: 'kanban.ticket.title' })
    const [title, setTitle] = useState(ticket.title || `${TicketTitle} №${ticket.number} / ${truncateDescription(ticket.details)}...`)
    const [editing, setEditing] = useState(false)
    const [error, setError] = useState('')
    
    const handleTitleChange = async () => {
        setError(null)
        if (title === ticket.title) return

        const errors = generateErrors(intl, { title }, { title: [is.required(), is.minLength(10), is.maxLength(100)] })
  
        if (errors.title) {
            setError(errors.title)
        } else {
            setEditing(true)
            try {
                await updateTicket({ title })
            } finally {
                setEditing(false)
            }
        }

    }

    return (
        <>
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
            {error && <ErrorText>{error}</ErrorText>}
        </>
    )
}

export default ProjectBoardIssueDetailsTitle
