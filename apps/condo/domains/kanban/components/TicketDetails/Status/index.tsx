import dayjs from 'dayjs'
import React, { Fragment, useState } from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'

import { ChevronDown } from '@open-condo/icons'

import {  color, font, mixin } from '../../../styles'
import { Select, Spinner } from '../../../ui'
import { formatDefferedDate } from '../../../utils'
import { DeferredUntilModal } from '../../DeferredUntilModal/DeferredUntilModal'
import { SectionTitle } from '../Styles'

const Status = styled.div<{ $isvalue?: boolean, $secondaryсolor: string, $primaryсolor: string }>`
  display:flex;
  gap: 5px;
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
const StatusContainer = styled.div`
    display:flex;
    gap: 10px;
    align-items: center;
`

const BeforeText = styled.div`
    background-color: ${color.backgroundLightest};
    border-radius: 7px;
    padding: 0 5px;
    color: ${color.textDark};
    ${font.size(15)}
`

const ProjectBoardTicketDetailsStatus = ({ ticket, ticketStatuses, updateTicket }) => {
    const intl = useIntl()
    const StatusTitle = intl.formatMessage({ id: 'Status' })
    const DefferedStatusTitle = intl.formatMessage({ id: 'ticket.status.DEFERRED.name' })
    const BeforeTitle = intl.formatMessage({ id: 'kanban.ticket.tickets.before' })
    const [deferredUntil, setDeferredUntil] = useState(dayjs())
    const [isOpenUntil, setOpenUntil] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleUpdateStatus = async (updatedStatus) => {
        if (updatedStatus === DefferedStatusTitle) {
            setOpenUntil(true)
        } else {
            setLoading(true)
            const status = {
                connect: { id: ticketStatuses[updatedStatus].id },
            }
            await updateTicket({ status })
        }
        setLoading(false)
    }

    const options = Object.keys(ticketStatuses).map(name => ({
        value: name,
        label: name,
    })) 
    
    const getStatusProps = (status) => {
        const { primary, secondary } = ticketStatuses[status].colors
        return { $secondaryсolor: primary, $primaryсolor: secondary }
    }

    const handleUntilClose = () => {
        setOpenUntil(false)
    }

    const handleUntilDateChange = () => {
        setLoading(true)
        const status = {
            connect: { id: ticketStatuses[DefferedStatusTitle].id },
        }
        updateTicket({ status, deferredUntil: deferredUntil })
        setLoading(false)
        setOpenUntil(false)
        setDeferredUntil(dayjs())
    }

    return (
        <>
            <DeferredUntilModal isOpen={isOpenUntil} value={deferredUntil} setValue={setDeferredUntil} onCancel={handleUntilClose} onOk={handleUntilDateChange} />
            <SectionTitle>{StatusTitle}</SectionTitle>
            <StatusContainer>
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
                                {loading ? <Spinner size={16} color='#fff'/> : <ChevronDown size='small' />}
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
                {ticket.deferredUntil && <BeforeText>{formatDefferedDate(BeforeTitle, ticket.deferredUntil)}</BeforeText>}
            </StatusContainer>
        </>
    )
}


export default ProjectBoardTicketDetailsStatus
