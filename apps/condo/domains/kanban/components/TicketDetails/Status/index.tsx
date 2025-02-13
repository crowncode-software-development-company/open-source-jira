import dayjs from 'dayjs'
import React, { Fragment, useState } from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'

import { ChevronDown } from '@open-condo/icons'

import {  mixin } from '../../../styles'
import { Select } from '../../../ui'
import { DeferredUntilModal } from '../../DeferredUntilModal/DeferredUntilModal'
import { SectionTitle } from '../Styles'

const Status = styled.div<{ $isvalue?: boolean, $secondaryсolor: string, $primaryсolor: string }>`
  text-transform: uppercase;
  font-weight: bold;
  transition: all 0.1s;
  ${props => mixin.tag(props.$secondaryсolor, props.$primaryсolor)}
  ${props =>
        props.$isvalue &&
    css`
      padding: 0 12px;
      height: 32px;
      &:hover {
        transform: scale(1.05);
      }
    `}
`

const ProjectBoardTicketDetailsStatus = ({ ticket, ticketStatuses, updateTicket }) => {
    const intl = useIntl()
    const StatusTitle = intl.formatMessage({ id: 'Status' })
    const DefferedStatusTitle = intl.formatMessage({ id: 'ticket.status.DEFERRED.name' })
    const [deferredUntil, setDeferredUntil] = useState(dayjs())
    const [isOpenUntil, setOpenUntil] = useState(false)
    
    const options = Object.entries(ticketStatuses).map(([name, id]) => ({
        value: name,
        label: name,
    })) 
    
    const getStatusProps = (status) => {
        const { primary, secondary } = ticketStatuses[status].colors
        return { $secondaryсolor: primary, $primaryсolor: secondary }
    }

    const handleUpdateStatus = (updatedStatus) => {
        if (updatedStatus === DefferedStatusTitle) {
            setOpenUntil(true)
        } else {
            const status = {
                connect: { id: ticketStatuses[updatedStatus].id },
            }
            updateTicket({ status })
        }
    }

    const handleUntilClose = () => {
        setOpenUntil(false)
    }

    const handleUntilDateChange = () => {
        const status = {
            connect: { id: ticketStatuses[DefferedStatusTitle].id },
        }
        updateTicket({ status, deferredUntil: deferredUntil })
        setOpenUntil(false)
        setDeferredUntil(dayjs())
    }

    return (
        <Fragment>
            <DeferredUntilModal isOpen={isOpenUntil} value={deferredUntil} setValue={setDeferredUntil} onCancel={handleUntilClose} onOk={handleUntilDateChange} />
            <SectionTitle>{StatusTitle}</SectionTitle>
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
                        <Status $isvalue {...statusProps}>
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
