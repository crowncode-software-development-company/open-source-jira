import React, { Fragment, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { color, font, mixin } from '../../../styles'
import { Button, TextEditedContent, TextEditor } from '../../../ui'
import { getTextContentsFromHtmlString } from '../../../utils'

const Title = styled.div`
  padding: 20px 0 6px;
  font-weight: 600;
  ${font.size(15)}
`
const EmptyLabel = styled.div`
  margin-left: -7px;
  padding: 7px;
  border-radius: 3px;
  color: ${color.textMedium}
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

const ProjectBoardIssueDetailsDescription = ({ ticket, updateTicket }) => {
    const intl = useIntl()
    const DescriptionTitle = intl.formatMessage({ id: 'Description' })
    const AddDescriptionTitle = intl.formatMessage({ id: 'kanban.ticket.addDescription.title' })
    const SaveTitle = intl.formatMessage({ id: 'Save' })
    const CancelTitle = intl.formatMessage({ id: 'Cancel' })
    const [description, setDescription] = useState(ticket.details)
    const [descriptionText, setDescriptionText] = useState(ticket.details)
    const [isEditing, setEditing] = useState(false)

    const handleUpdate = () => {
        setEditing(false)
        updateTicket({
            details: description,
        })
    }

    const handleCancel = () => {
        setDescription(ticket.details)
        setEditing(false)
    }

    const isDescriptionEmpty = description.trim().length === 0

    return (
        <Fragment>
            <Title>{DescriptionTitle}</Title>
            {isEditing ? (
                <Fragment>
                    <TextEditor value = {description}  onChange={(value) => setDescription(value)} onChangeText = {(value) => setDescriptionText(value)}/>
                    <Actions>
                        <Button variant='primary' onClick={handleUpdate}>{SaveTitle}</Button>
                        <Button variant='empty' onClick={handleCancel}>{CancelTitle}</Button>
                    </Actions>
                </Fragment>
            ) : (
                <Fragment>
                    {isDescriptionEmpty ? (
                        <EmptyLabel onClick={() => setEditing(true)}>{AddDescriptionTitle}</EmptyLabel>
                    ) : (
                        <TextEditedContent content={description} onClick={() => setEditing(true)} />
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}

export default ProjectBoardIssueDetailsDescription
