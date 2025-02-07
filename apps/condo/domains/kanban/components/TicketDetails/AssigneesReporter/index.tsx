import React, { Fragment } from 'react'
import styled, { css } from 'styled-components'

import { Close } from '@open-condo/icons'

import { color, font, mixin } from '../../../styles'
import { Avatar, Select } from '../../../ui'

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
const SectionTitle = styled.div`
  margin: 24px 0 5px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${color.textMedium};
  ${font.size(12.5)}
`

const ProjectBoardIssueDetailsAssigneesReporter = ({ ticket, updateTicket, employees }) => {
    const getEmployeeById = employeeId => employees.find(employee => employee.user.id === employeeId)

    const employeesOptions = employees.map(employee => ({ value: employee.user.id, label: employee.user.name }))


    const handleAssigneeChange = (userId) => {
        const assignee = {
            connect: { id: userId },
        }
        updateTicket({ assignee })
    }

    const handleExecutorChange = (userId) => {
        const executor = {
            connect: { id:userId },
        }
        updateTicket({ executor })
    }

    return (
        <Fragment>
            <SectionTitle>Assignees</SectionTitle>
            <Select
                variant='empty'
                dropdownWidth={250}
                withClearValue={false}
                placeholder='Unassigned'
                name='assignees'
                value={ticket.assignee.id}
                options={employeesOptions}
                onChange={employeeIds => handleAssigneeChange(employeeIds)}
                renderValue={({ value: employeeId }) => renderUser(getEmployeeById(employeeId), true)}
                renderOption={({ value: employeeId }) => renderUser(getEmployeeById(employeeId))}
            />

            <SectionTitle>Reporter</SectionTitle>
            <Select
                variant='empty'
                dropdownWidth={250}
                withClearValue={false}
                placeholder='Unreported'
                name='reporter'
                value={ticket.executor.id}
                options={employeesOptions}
                onChange={employeeIds => handleExecutorChange(employeeIds)}
                renderValue={({ value: employeeId }) => renderUser(getEmployeeById(employeeId), true)}
                renderOption={({ value: employeeId }) => renderUser(getEmployeeById(employeeId))}
            />
        </Fragment>
    )
}

const renderUser = (user, isSelectValue?, removeOptionValue?) => (
    <User
        key={user.id}
        $isselectvalue={isSelectValue}
        $withbottommargin={!!removeOptionValue}
        onClick={() => removeOptionValue && removeOptionValue()}
    >
        <Avatar avatarUrl={user.avatarUrl} name={user.name} size={24} />
        <Username>{user.name}</Username>
        {removeOptionValue && <Close size='small'/>}
    </User>
)

export default ProjectBoardIssueDetailsAssigneesReporter
