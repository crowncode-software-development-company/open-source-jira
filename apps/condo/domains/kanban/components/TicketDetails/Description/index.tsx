import React, { Fragment, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { color, font, mixin } from '../../../styles'
import { Button, TextEditedContent, TextEditor } from '../../../ui'
import { getTextContentsFromHtmlString, isEmptyHtml } from '../../../utils'

const Title = styled.div`
  padding: 20px 0 6px;
  font-weight: 600;
  ${font.size(15)}
`
const EmptyLabel = styled.div`
  margin-left: -7px;
  padding: 7px;
  border-radius: 3px;
  color: ${color.textLight}
  transition: background 0.1s;
  ${font.size(15)}
  ${mixin.clickable}
  &:hover {
    background: ${color.backgroundLight};
  }
`

const Actions = styled.div`
  display: flex;
  padding-top: 12px;
  & > button {
    margin-right: 6px;
  }
`

const ProjectBoardTicketDetailsDescription = ({ ticket, updateTicket, refetchTicketFiles }) => {
    const intl = useIntl()
    const DescriptionTitle = intl.formatMessage({ id: 'Description' })
    const AddDescriptionTitle = intl.formatMessage({ id: 'kanban.ticket.addDescription.title' })
    const SaveTitle = intl.formatMessage({ id: 'Save' })
    const CancelTitle = intl.formatMessage({ id: 'Cancel' })
    const [descriptionHtml, setDescriptionHtml] = useState<string>(ticket.meta?.detailsHtml || ticket.details)
    const [isEditing, setEditing] = useState(false)

    const handleUpdate = async () => {
        setEditing(false)
        const descriptionText = getTextContentsFromHtmlString(descriptionHtml)
        try {
            updateTicket({
                details: descriptionText,
                meta: { ...ticket.meta, detailsHtml: descriptionHtml, dv: 1 },
            })
            await refetchTicketFiles()
        }
        catch {
            setDescriptionHtml(ticket.meta?.detailsHtml || ticket.details)
        }
    }

    const handleCancel = () => {
        setDescriptionHtml(ticket.meta?.detailsHtml || ticket.details)
        setEditing(false)
    }

    const isDescriptionEmpty = isEmptyHtml(descriptionHtml)

    return (
        <>
            <Title>{DescriptionTitle}</Title>
            {console.log(ticket)
            }
            {isEditing ? (
                <>
                    <TextEditor action='update' ticketId ={ticket.id} value = {descriptionHtml}  onChange={(value) => setDescriptionHtml(value)}/>
                    <Actions>
                        <Button variant='primary' onClick={handleUpdate}>{SaveTitle}</Button>
                        <Button variant='empty' onClick={handleCancel}>{CancelTitle}</Button>
                    </Actions>
                </>
            ) : (
                <>
                    {isDescriptionEmpty ? (
                        <EmptyLabel onClick={() => setEditing(true)}>{AddDescriptionTitle}</EmptyLabel>
                    ) : (
                        <TextEditedContent content={descriptionHtml || ticket.details} onClick={() => setEditing(true)} />
                    )}
                </>
            )}
        </>
    )
}

export default ProjectBoardTicketDetailsDescription
