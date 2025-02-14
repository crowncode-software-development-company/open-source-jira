import React, { Fragment, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { getClientSideSenderInfo } from '@open-condo/codegen/utils/userId'

import ProTip from './ProTip'

import { useCreateTicketCommentMutation } from '../../../../../../gql'
import { color, font, mixin } from '../../../../styles'
import { Avatar } from '../../../../ui'
import BodyForm from '../BodyForm'


const Create = styled.div`
  position: relative;
  margin-top: 25px;
  ${font.size(15)}
`

const UserAvatar = styled(Avatar)`
  position: absolute;
  top: 0;
  left: 0;
`

const Right = styled.div`
  padding-left: 44px;
`

const FakeTextarea = styled.div`
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid ${color.borderLightest};
  color: ${color.textLight};
  ${mixin.clickable}
  &:hover {
    border: 1px solid ${color.borderLight};
  }
`

const ProjectBoardIssueDetailsCommentsCreate = ({ ticketId, user, onCompleted }) => {
    const intl = useIntl()
    const AddCommentTitle = intl.formatMessage({ id: 'kanban.ticket.addComment.title' })
    const [isFormOpen, setFormOpen] = useState(false)
    const [isCreating, setCreating] = useState(false)
    const [body, setBody] = useState<any>('')
    const [createCommentAction] = useCreateTicketCommentMutation({ onCompleted: onCompleted })

    const handleCommentCreate = async () => {
        setCreating(true)
        await createCommentAction({
            variables: {
                data: {
                    content: body,
                    ticket: { connect: { id: ticketId } },
                    user: { connect: { id: user?.id || null } },
                    dv: 1,
                    sender: getClientSideSenderInfo(),
                },
            },
        })
        clearForm()
        setCreating(false)
    }

    const clearForm = () => {
        setFormOpen(false)
        setBody('')
    }
    
    return (
        <Create>
            <UserAvatar name={user.name} />
            <Right>
                {isFormOpen ? (
                    <BodyForm
                        value={body}
                        onChange={setBody}
                        isWorking={isCreating}
                        onSubmit={handleCommentCreate}
                        onCancel={clearForm}
                    />
                ) : (
                    <Fragment>
                        <FakeTextarea onClick={() => setFormOpen(true)}>{AddCommentTitle}</FakeTextarea>
                        <ProTip setFormOpen={setFormOpen} />
                    </Fragment>
                )}
            </Right>
        </Create>
    )
}

export default ProjectBoardIssueDetailsCommentsCreate
