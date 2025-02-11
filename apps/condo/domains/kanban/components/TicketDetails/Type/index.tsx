import React from 'react'
import styled from 'styled-components'

import { color, font } from '../../../styles'
import { Button, Select, TicketTypeIcon } from '../../../ui'


const TypeButton = styled(Button)`
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${color.textMedium};
  ${font.size(13)}
`

export const Type = styled.div`
  display: flex;
  align-items: center;
`

export const TypeLabel = styled.div`
  padding: 0 5px 0 7px;
  ${font.size(15)}
`

const ProjectBoardIssueDetailsType = ({ ticket }) => (
    // <Select
    //     variant='empty'
    //     dropdownWidth={150}
    //     withClearValue={false}
    //     name='type'
    //     value={issue.type}
    //     options={Object.values(IssueType).map(type => ({
    //         value: type,
    //         label: IssueTypeCopy[type],
    //     }))}
    //     onChange={type => updateIssue({ type })}
    //     renderValue={({ value: type }) => (
    <TypeButton variant='empty' icon={<TicketTypeIcon type='task' size='large'/>}>
        {`Task-${ticket.number}`}
    </TypeButton>
    //     )}
    //     renderOption={({ value: type }) => (
    //         <Type key={type} onClick={() => updateIssue({ type })}>
    //             <TicketTypeIcon type={type} size='large'/>
    //             <TypeLabel>{IssueTypeCopy[type]}</TypeLabel>
    //         </Type>
    //     )}
    // />
)

export default ProjectBoardIssueDetailsType
