import React, { Fragment } from 'react'
import styled from 'styled-components'

import { Button, Textarea } from '../../../../ui'


const Actions = styled.div`
  display: flex;
  padding-top: 10px;
  gap: 5px;
`

const FormButton = styled(Button)`
  margin-right: 6px;
`


interface IProps {
    value: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    isWorking: boolean
    onSubmit: () => void
    onCancel: () => void
}

const ProjectBoardIssueDetailsCommentsBodyForm: React.FC<IProps> = ({ value, onChange, isWorking, onSubmit, onCancel }) => {

    return (
        <Fragment>
            <Textarea
                value={value}
                autoFocus
                placeholder='Add a comment...'
                onChange={onChange}
            />
            <Actions>
                <FormButton variant='primary' isWorking={isWorking} onClick={onSubmit}>
          Save
                </FormButton>
                <FormButton variant='empty' onClick={onCancel}>
          Cancel
                </FormButton>
            </Actions>
        </Fragment>
    )
}

export default ProjectBoardIssueDetailsCommentsBodyForm
