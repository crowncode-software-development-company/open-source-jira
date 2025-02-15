import { notification } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import Comment from './Comment'
import Create from './Create'

import { useNotificationMessages } from '../../../../common/hooks/useNotificationMessages'
import { font } from '../../../styles'
import { sortByNewest } from '../../../utils'


const Comments = styled.div`
  padding-top: 40px;
`

const Title = styled.div`
  ${font.size(15)};
  font-weight: 600;
`

const ProjectBoardIssueDetailsComments = ({ refetchTicketComments, ticket, comments, user }) => {
    const intl = useIntl()
    
    const CommentsTitle = intl.formatMessage({ id: 'Comments.title' })
    const { getSuccessfulChangeNotification } = useNotificationMessages()
    
    const onCompleted = async () => {
        await refetchTicketComments()
        notification.success(getSuccessfulChangeNotification())
    }

    return (
        <Comments>
            <Title>{CommentsTitle}</Title>
            <Create ticketId={ticket.id} user={user} onCompleted={onCompleted} />

            {sortByNewest(comments, 'createdAt').map(comment => (
                <Comment onCompleted={onCompleted} key={comment.id} comment={comment} userId = {user.id}/>
            ))}
        </Comments>
    )
}

export default ProjectBoardIssueDetailsComments
