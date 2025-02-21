import React, { Fragment, useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { useMultipleFileUploadHook } from '../../../../../common/components/MultipleFileUpload'
import { TicketCommentFile } from '../../../../../ticket/utils/clientSchema'
import { KeyCodes } from '../../../../constants'
import { Button, Textarea } from '../../../../ui'


const Actions = styled.div`
  display: flex;
  margin-top: 10px;
  flex-direction: row;
  gap: 5px;
`

const FormButton = styled(Button)`
  margin-right: 6px;
`
interface IProps {
    value: string
    onChange: React.Dispatch<React.SetStateAction<string>>
    isWorking: boolean
    onSubmit: () => void
    onCancel: () => void
}

const ProjectBoardIssueDetailsCommentsBodyForm: React.FC<IProps> = ({ value, onChange, isWorking, onSubmit, onCancel }) => {
    const intl = useIntl()
    const AddCommentTitle = intl.formatMessage({ id: 'kanban.ticket.addComment.title' })
    const SaveTitle = intl.formatMessage({ id: 'Save' })
    const CancelTitle = intl.formatMessage({ id: 'Cancel' })
    const textareaRef = useRef(null)

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus( { cursor: 'end' })
        }
    }, [])

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.keyCode === KeyCodes.ENTER) {
            if (!event.shiftKey) {
                event.preventDefault()
                onSubmit()
            }
        }
    }  

    return (
        <>
            <Textarea
                disabled={isWorking}
                ref={textareaRef}
                value={value}
                autoFocus
                placeholder={AddCommentTitle}
                onChange={onChange}
                onKeyDown={handleKeyDown}
            />
            <Actions>
                <FormButton variant='primary' isWorking={isWorking} onClick={onSubmit}>
                    {SaveTitle}
                </FormButton>
                <FormButton variant='empty' onClick={onCancel}>
                    {CancelTitle}
                </FormButton>
            </Actions>
        </>
    )
}

export default ProjectBoardIssueDetailsCommentsBodyForm
