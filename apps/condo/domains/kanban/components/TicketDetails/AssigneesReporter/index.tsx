import React, { Fragment, useState } from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'

import { Close } from '@open-condo/icons'

import { color, font, mixin } from '../../../styles'
import { Avatar, Select, Spinner } from '../../../ui'
import { SectionTitle } from '../Styles'

const User = styled.div<{ $isselectvalue?: boolean, $withbottommargin?: boolean }>`
  display: flex;
  align-items: center;
  ${mixin.clickable}
  ${props =>
        props.$isselectvalue &&
    css`
      margin: 0 10px ${props.$withbottommargin ? 5 : 0}px 0;
      padding: 4px 8px;
      border-radius: 4px;
      background: ${color.backgroundLight};
      transition: background 0.1s;
      &:hover {
        background: ${color.backgroundMedium};
      }
    `}
`

const Username = styled.div`
  padding: 0 3px 0 8px;
  ${font.size(14.5)}
`

const SelectCont = styled.div`
width: 100;
display: flex;
flex-direction:row;
align-items:center;
gap: 5px;
`

const ProjectBoardIssueDetailsAssigneesExecutor = ({ ticket, updateTicket, users }) => {
    const intl = useIntl()
    const AssigneeMessage = intl.formatMessage({ id: 'pages.ticket.autoAssignment.columns.assignee.title' })
    const ExecutorMessage = intl.formatMessage({ id: 'pages.ticket.autoAssignment.columns.executor.title' })
    const [assigneeLoading, setAssigneeLoading] = useState(false)
    const [executorLoading, setExecutorLoading] = useState(false)
    const getUserById = userId => users.find(user => user.id === userId)

    const usersOptions = users.map(user => ({ value: user.id, label: user.name }))


    const handleAssigneeChange = async (userId) => {
        setAssigneeLoading(true)
        try {
            const assignee = { connect: { id: userId } }
            await updateTicket({ assignee })
        } finally {
            setAssigneeLoading(false)
        }
    }

    const handleExecutorChange = async (userId) => {
        setExecutorLoading(true)
        try {
            const executor = { connect: { id: userId } }
            await updateTicket({ executor })
        } finally {
            setExecutorLoading(false)
        }
    }

    return (
        <>
            <SectionTitle>{AssigneeMessage}</SectionTitle>
            <SelectCont>
                <Select
                    variant='empty'
                    dropdownWidth={300}
                    withClearValue={false}
                    placeholder='Unassigned'
                    name='assignees'
                    value={ticket.assignee?.id || null}
                    options={usersOptions}
                    onChange={userIds => handleAssigneeChange(userIds)}
                    renderValue={({ value: userId }) => renderUser(getUserById(userId), true)}
                    renderOption={({ value: userId }) => renderUser(getUserById(userId))}
                />
                {assigneeLoading && <Spinner size={20}/>}
            </SelectCont>
            <SectionTitle>{ExecutorMessage}</SectionTitle>
            <SelectCont>
                <Select
                    variant='empty'
                    dropdownWidth={300}
                    withClearValue={false}
                    placeholder='Unreported'
                    name='reporter'
                    value={ticket.executor?.id || null}
                    options={usersOptions}
                    onChange={userIds => handleExecutorChange(userIds)}
                    renderValue={({ value: userId }) => renderUser(getUserById(userId), true)}
                    renderOption={({ value: userId }) => renderUser(getUserById(userId))}
                />
                {executorLoading && <Spinner size={20}/>}
            </SelectCont>
        </>
    )
}

const renderUser = (user, isSelectValue?, removeOptionValue?) => (
    <User
        key={user.id}
        $isselectvalue={isSelectValue}
        $withbottommargin={!!removeOptionValue}
        onClick={() => removeOptionValue?.()}
    >
        <Avatar avatarUrl={user.avatarUrl} name={user.name} size={24} />
        <Username>{user.name}</Username>
        {removeOptionValue && <Close size='small'/>}
    </User>
)

export default ProjectBoardIssueDetailsAssigneesExecutor
