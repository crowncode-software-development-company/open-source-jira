import React, { Fragment } from 'react'
import styled, { css } from 'styled-components'

import { Close } from '@open-condo/icons'

import { color, font, mixin } from '../../../styles'
import { Avatar, Select } from '../../../ui'

const User = styled.div<{ isSelectValue?: boolean, withBottomMargin?: boolean }>`
  display: flex;
  align-items: center;
  ${mixin.clickable}
  ${props =>
        props.isSelectValue &&
    css`
      margin: 0 10px ${props.withBottomMargin ? 5 : 0}px 0;
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

interface IProps {
    issue: any
    updateIssue: () => void
    projectUsers: any
}

const ProjectBoardIssueDetailsAssigneesReporter: React.FC<IProps> = ({
    issue,
    updateIssue,
    projectUsers,
}) => {
    const getUserById = userId => projectUsers.find(user => user.id === userId)

    const userOptions = projectUsers.map(user => ({ value: user.id, label: user.name }))

    return (
        <Fragment>
            <SectionTitle>Assignees</SectionTitle>
            <Select
                isMulti
                variant='empty'
                dropdownWidth={343}
                placeholder='Unassigned'
                name='assignees'
                value={issue.userIds}
                options={userOptions}
                onChange={userIds => {
                    updateIssue()
                }}
                renderValue={({ value: userId, removeOptionValue }) =>
                    renderUser(getUserById(userId), true, removeOptionValue)
                }
                renderOption={({ value: userId }) => renderUser(getUserById(userId), false)}
            />

            <SectionTitle>Reporter</SectionTitle>
            <Select
                variant='empty'
                dropdownWidth={343}
                withClearValue={false}
                name='reporter'
                value={issue.reporterId}
                options={userOptions}
                onChange={userId => updateIssue()}
                renderValue={({ value: userId }) => renderUser(getUserById(userId), true)}
                renderOption={({ value: userId }) => renderUser(getUserById(userId))}
            />
        </Fragment>
    )
}

const renderUser = (user, isSelectValue?, removeOptionValue?) => (
    <User
        key={user.id}
        isSelectValue={isSelectValue}
        withBottomMargin={!!removeOptionValue}
        onClick={() => removeOptionValue && removeOptionValue()}
    >
        <Avatar avatarUrl={user.avatarUrl} name={user.name} size={24} />
        <Username>{user.name}</Username>
        {removeOptionValue && <Close size='small'/>}
    </User>
)

export default ProjectBoardIssueDetailsAssigneesReporter
