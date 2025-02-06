import React, { Fragment } from 'react'
import styled, { css } from 'styled-components'

import { ChevronDown } from '@open-condo/icons'

import {  mixin, color, font } from '../../../styles'
import { Select } from '../../../ui'

const Status = styled.div<{ isValue?: boolean, secondaryColor: string, primaryColor: string }>`
  text-transform: uppercase;
  font-weight: bold;
  transition: all 0.1s;
  ${props => mixin.tag(props.secondaryColor, props.primaryColor)}
  ${props =>
        props.isValue &&
    css`
      padding: 0 12px;
      height: 32px;
      &:hover {
        transform: scale(1.05);
      }
    `}
`

export const SectionTitle = styled.div`
  margin: 24px 0 5px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${color.textMedium};
  ${font.size(12.5)}
`

const ProjectBoardTicketDetailsStatus = ({ ticket, ticketStatuses, updateTicket }) => {
    const options = Object.entries(ticketStatuses).map(([name, id]) => ({
        value: name,
        label: name,
    })) 
    
    const getStatusProps = (status) => {
        const { primary, secondary } = ticketStatuses[status].colors
        return { secondaryColor: primary, primaryColor: secondary }
    }

    const handleUpdateStatus = (updatedStatus) => {
        const status = {
            connect: { id: ticketStatuses[updatedStatus].id },
        }
        updateTicket({ status })
    }

    return (
        <Fragment>
            <SectionTitle>Status</SectionTitle>
            <Select
                variant='empty'
                dropdownWidth={250}
                withClearValue={false}
                name='status'
                value={ticket.status.name}
                options={options}
                onChange={status => handleUpdateStatus(status)}
                renderValue={({ value: status }) => {
                    const statusProps = getStatusProps(status)
                    return (
                        <Status isValue {...statusProps}>
                            <div>{status}</div>
                            <ChevronDown size='small' />
                        </Status>
                    )
                }}
                renderOption={({ value: status }) => {
                    const statusProps = getStatusProps(status)
                    return (
                        <Status {...statusProps}>
                            {status}
                        </Status>
                    )
                }}
            />
        </Fragment>
    )
}


export default ProjectBoardTicketDetailsStatus
