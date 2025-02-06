import React, { Fragment, useState } from 'react'
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

const ProjectBoardIssueDetailsDescription = ({ issue, updateIssue }) => {
    const [description, setDescription] = useState(issue.details)
    const [isEditing, setEditing] = useState(false)

    const handleUpdate = () => {
        setEditing(false)
        updateIssue()
    }

    const isDescriptionEmpty = description.trim().length === 0

    return (
        <Fragment>
            <Title>Description</Title>
            {isEditing ? (
                <Fragment>
                    <TextEditor placeholder='Describe the issue' value = {description}  onChange={(value) => setDescription(value)}/>
                    <Actions>
                        <Button variant='primary' onClick={handleUpdate}>Save</Button>
                        <Button variant='empty' onClick={() => setEditing(false)}>Cancel</Button>
                    </Actions>
                </Fragment>
            ) : (
                <Fragment>
                    {isDescriptionEmpty ? (
                        <EmptyLabel onClick={() => setEditing(true)}>Add a description...</EmptyLabel>
                    ) : (
                        <TextEditedContent content={description} onClick={() => setEditing(true)} />
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}

export default ProjectBoardIssueDetailsDescription
