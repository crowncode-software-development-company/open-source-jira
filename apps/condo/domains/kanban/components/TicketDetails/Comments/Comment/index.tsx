import React, { Fragment, useState } from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'

import { getClientSideSenderInfo } from '@condo/domains/common/utils/userid.utils'

import { useUpdateTicketCommentMutation } from '../../../../../../gql'
import { color, font, mixin } from '../../../../styles'
import { Avatar, ConfirmModal } from '../../../../ui'
import { formatDateTimeConversational } from '../../../../utils'
import BodyForm from '../BodyForm'

const Comment = styled.div`
  position: relative;
  margin-top: 25px;
  ${font.size(15)}
`
const UserAvatar = styled(Avatar)`
  position: absolute;
  top: 0;
  left: 0;
`

const Content = styled.div`
  padding-left: 44px;
`

const Username = styled.div`
  display: inline-block;
  padding-right: 12px;
  font-weight: 600;
  color: ${color.textDark};
`

const CreatedAt = styled.div`
  display: inline-block;
  color: ${color.textDark};
  ${font.size(14.5)}
   &:before {
    position: relative;
    right: 6px;
    content: '·';
    display: inline-block;
  }
`

const Body = styled.p`
  white-space: pre-wrap;
  margin: 3px 0 ;
`

const actionLinkStyles = css`
  display: inline-block;
  padding: 2px 0;
  color: ${color.textMedium};
  ${font.size(14.5)}
  ${mixin.clickable}
  &:hover {
    text-decoration: underline;
  }
`

const EditLink = styled.div`
  margin-right: 12px;
  ${actionLinkStyles}
`

const DeleteLink = styled.div`
  ${actionLinkStyles}
  &:before {
    position: relative;
    right: 6px;
    content: '·';
    display: inline-block;
  }
`

const ProjectBoardIssueDetailsComment = ({ comment, userId, onCompleted }) => {
    const intl = useIntl()
    const EditTitle = intl.formatMessage({ id: 'Change' })
    const DeleteTitle = intl.formatMessage({ id: 'Delete' })
    const DeleteСonfirmText = intl.formatMessage({ id: 'kanban.comment.delete.confirmText' })
    const DeleteModalTitle = intl.formatMessage({ id: 'kanban.comment.delete.title' })
    const DeleteMessage = intl.formatMessage({ id: 'kanban.comment.delete.message' })
    const ChangeTitle = intl.formatMessage({ id: 'kanban.comment.change.title' })
    const [isFormOpen, setFormOpen] = useState(false)
    const [isUpdating, setUpdating] = useState(false)
    const [body, setBody] = useState(comment.content)

    const [updateComment] = useUpdateTicketCommentMutation({
        onCompleted: onCompleted,
    })
    

    const updateAction = async ({ updateData }) => {
        await updateComment({
            variables: {
                id: comment.id,
                data: updateData,
            },
        })
    }
  
    const handleDelete = async () => {
        await updateAction({
            updateData: {
                deletedAt: new Date().toISOString(),
                dv: 1,
                sender: getClientSideSenderInfo(),
            },
        })
    }
  
    const handleUpdate = async () => {
        setUpdating(true)
        await updateAction({
            updateData: {
                content: body,
                dv: 1,
                sender: getClientSideSenderInfo(),
            },
        }).then(() => {setFormOpen(false); setUpdating(false)})
    }

    const handleCancel = () => {
        setFormOpen(false)
        setBody(comment.content)
        setUpdating(false)
    }
  
    return (
        <Comment>
            <UserAvatar name={comment.user.name} avatarUrl={comment.user.avatarUrl}/>
            <Content>
                <Username>{comment.user.name}</Username>
                {comment.createdAt === comment.updatedAt ?
                    <CreatedAt>({formatDateTimeConversational(comment.createdAt)})</CreatedAt> 
                    : 
                    <CreatedAt>({ChangeTitle} {formatDateTimeConversational(comment.updatedAt)})</CreatedAt>
                }

                {isFormOpen ? (
                    <BodyForm
                        value={body}
                        onChange={setBody}
                        isWorking={isUpdating}
                        onSubmit={handleUpdate}
                        onCancel={handleCancel}
                    />
                ) : (
                    <Fragment>
                        <Body>{comment.content}</Body>
                        {userId === comment.user.id && (
                            <>
                                <EditLink onClick={() => setFormOpen(true)}>{EditTitle}</EditLink>
                                <ConfirmModal
                                    title={DeleteModalTitle}
                                    message={DeleteMessage}
                                    confirmText={DeleteСonfirmText}
                                    onConfirm={handleDelete}
                                    renderLink={modal => <DeleteLink onClick={modal.open}>{DeleteTitle}</DeleteLink>}
                                />
                            </>
                        )}
                    </Fragment>
                )}
            </Content>
        </Comment>
    )
}

export default ProjectBoardIssueDetailsComment
