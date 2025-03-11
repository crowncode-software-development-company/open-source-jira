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

    const handleUserChange = async (userId, isDisconnect, setLoading, role) => {
        setLoading(true)
        try {
            const connection = isDisconnect ? { disconnect: { id: userId } } : { connect: { id: userId } }
            await updateTicket({ [role]: connection })
        } finally {
            setLoading(false)
        }
    }

    const handleAssigneeChange = (userId, isDisconnect) => 
        handleUserChange(userId, isDisconnect, setAssigneeLoading, 'assignee')

    const handleExecutorChange = (userId, isDisconnect) => 
        handleUserChange(userId, isDisconnect, setExecutorLoading, 'executor')

    const renderUser = (user, isSelectValue?, removeOptionValue?) => (
        <User key={user.id} $isselectvalue={isSelectValue} $withbottommargin={!!removeOptionValue}>
            <Avatar avatarUrl={user.avatarUrl} name={user.name} size={24} />
            <Username>{user.name}</Username>
            {removeOptionValue && <Close size='small' color={color.textMedium} onClick={removeOptionValue} />}
        </User>
    )

    const UserSelect = ({ loading, onChange, value, placeholder }) => (
        <SelectCont>
            <Select
                variant='empty'
                dropdownWidth={300}
                placeholder={placeholder}
                value={value}
                options={usersOptions}
                onChange={userIds => onChange(userIds)}
                renderValue={({ value: userId }) => renderUser(getUserById(userId), true, () => onChange(userId, true))}
                renderOption={({ value: userId }) => renderUser(getUserById(userId))}
            />
            {loading && <Spinner size={20} />}
        </SelectCont>
    )

    return (
        <>
            <SectionTitle>{AssigneeMessage}</SectionTitle>
            <UserSelect
                loading={assigneeLoading}
                onChange={handleAssigneeChange}
                value={ticket.assignee?.id || null}
                placeholder='Unassigned'
            />
            <SectionTitle>{ExecutorMessage}</SectionTitle>
            <UserSelect
                loading={executorLoading}
                onChange={handleExecutorChange}
                value={ticket.executor?.id || null}
                placeholder='Unreported'
            />
        </>
    )
}
export default ProjectBoardIssueDetailsAssigneesExecutor
