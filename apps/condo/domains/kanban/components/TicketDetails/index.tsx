import { notification } from 'antd'
import  { useRouter } from 'next/router'
import React, { Fragment, useMemo } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { getClientSideSenderInfo } from '@open-condo/codegen/utils/userId'
import { Close } from '@open-condo/icons'
import { useAuth } from '@open-condo/next/auth'

import AssigneesExecutor from './AssigneesReporter'
import Comments from './Comments'
import CopyLinkButton from './CopyLinkButton'
import Dates from './Dates'
import Deadline from './Deadline'
import Delete from './Delete'
import Description from './Description'
import Priority from './Priority'
import Status from './Status'
import Title from './Title'
import Type from './Type'

import { useGetTicketByIdQuery, useGetTicketCommentsQuery, useUpdateTicketMutation } from '../../../../gql'
import LoadingOrErrorPage from '../../../common/components/containers/LoadingOrErrorPage'
import { OrganizationEmployee } from '../../../organization/utils/clientSchema'
import { usePollTicketComments } from '../../../ticket/hooks/usePollTicketComments'
import { Button } from '../../ui'

const Content = styled.div`
  display: flex;
  gap: 40px;
`

const Left = styled.div`
  width: 65%;
`

const Right = styled.div`
  width: 35%;
`

const TopActions = styled.div`
  display: flex;
  justify-content: space-between;
`

const TopActionsRight = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  margin-left: 30px;
`

const ProjectBoardTicketDetails = ({ organizationId, ticketStatuses, modalClose, refetchTicketsBoard }) => {
    const { user } = useAuth()
    const { query } = useRouter()
    const intl = useIntl()
    const ErrorTitle = intl.formatMessage({ id: 'ErrorOccurred' })
    const { ticketId } = query as { ticketId: string }
    const {
        data: ticketByIdData,
        loading: ticketLoading,
        refetch: refetchTicket,
        error,
    } = useGetTicketByIdQuery({
        variables: { id: ticketId },
        skip: !ticketId,
    })
    const ticket = useMemo(() => ticketByIdData?.tickets?.filter(Boolean)[0], [ticketByIdData?.tickets])

    const {
        loading: ticketCommentsLoading,
        data: ticketCommentsData,
        refetch: refetchTicketComments,
    } = useGetTicketCommentsQuery({
        variables: { ticketId: ticketId },
        skip: !ticketId,
    })
    const comments = useMemo(() => ticketCommentsData?.ticketComments?.filter(Boolean) || [],
        [ticketCommentsData?.ticketComments])

    const pollCommentsQuery = useMemo(() => ({ ticket: { organization: { id: organizationId } } }),
        [organizationId])

    usePollTicketComments({
        ticket,
        refetchTicketComments,
        pollCommentsQuery,
    })

    const [updateTicket] = useUpdateTicketMutation({
        onCompleted: async () => {
            await refetchTicket()
            await refetchTicketsBoard()
        },

        onError: async () => {
            notification.error({ message: ErrorTitle })
        },
    })
        
    const updateTicketAction = async (updatedData) => {
        await updateTicket({
            variables: {
                id: ticket.id,
                data: { ...updatedData,
                    dv: 1,
                    sender: getClientSideSenderInfo(),
                },
            },
        })
    }

    const { objs: employeesData, loading: employeesLoading } = OrganizationEmployee.useAllObjects({
        where: {
            organization: { id: organizationId },
            user: { deletedAt: null },
            deletedAt: null,
            isBlocked: false,
            isRejected: false,
        },
    })
    
    const employees = useMemo(() => employeesData?.filter(Boolean) || [], [employeesData])

    const loading = ticketLoading || ticketCommentsLoading || !ticket || employeesLoading

    if (loading) {
        return (
            <LoadingOrErrorPage
                loading={loading}
                error={error}
            />
        )
    }
    
    return (
        <Fragment>
            <TopActions>
                <Type ticket={ticket} />
                <TopActionsRight>
                    <CopyLinkButton />
                    <Delete ticket={ticket} refetchTicketsBoard={refetchTicketsBoard}/>
                    <Button icon={<Close/>} iconSize={24} variant='empty' onClick={modalClose} />
                </TopActionsRight>
            </TopActions>
            <Content>
                <Left>
                    <Title ticket={ticket} updateTicket={updateTicketAction} />
                    <Description ticket={ticket} updateTicket={updateTicketAction} />
                    <Comments refetchTicketComments={refetchTicketComments} user={user} ticket={ticket} comments={comments} />  
                </Left>
                <Right>
                    <Status ticket={ticket} ticketStatuses={ticketStatuses} updateTicket={updateTicketAction}/>
                    <AssigneesExecutor ticket={ticket} updateTicket={updateTicketAction} employees={employees} />
                    <Priority ticket={ticket} updateTicket={updateTicketAction} />
                    <Deadline ticket={ticket} updateTicket={updateTicketAction} />
                    <Dates ticket={ticket} /> 
                </Right>
            </Content>
        </Fragment>
    )
}


export default ProjectBoardTicketDetails
