import { notification } from 'antd'
import { get } from 'lodash'
import  { useRouter } from 'next/router'
import React, { Fragment, useMemo } from 'react'
import styled from 'styled-components'

import { getClientSideSenderInfo } from '@open-condo/codegen/utils/userId'
import { Close } from '@open-condo/icons'
import { useAuth } from '@open-condo/next/auth'
import { useOrganization } from '@open-condo/next/organization'

import AssigneesReporter from './AssigneesReporter'
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

export const Left = styled.div`
  width: 65%;
`

export const Right = styled.div`
  width: 35%;
`

export const TopActions = styled.div`
  display: flex;
  justify-content: space-between;
`

export const TopActionsRight = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  margin-left: 30px;
`

export const SectionTitle = styled.div`
  text-transform: uppercase;
`

const ProjectBoardTicketDetails = ({ organizationId, ticketStatuses, modalClose, refetchTicketsBoard }) => {

    const issue = {
        'id': 2729479,
        'title': 'You can track how many hours were spent working on an issue, and how many hours remain.',
        'type': 'task',
        'status': 'inprogress',
        'priority': '1',
        'listPosition': 7,
        'description': '<p>Before you start work on an issue, you can set a time or other type of estimate to calculate how much work you believe it\'ll take to resolve it. Once you\'ve started to work on a specific issue, log time to keep a record of it.</p><p><br></p><ul><li>Open the issue and select&nbsp;••• &gt;&nbsp;Time tracking</li><li>Fill in the<strong>&nbsp;Time Spent</strong>&nbsp;field</li><li>Fill in the <strong>Time Remaining</strong> field and click Save</li></ul><p><br></p><h3><u style="background-color: initial;">That\'s it!</u></h3><h1>💯💯</h1>',
        'descriptionText': 'Before you start work on an issue, you can set a time or other type of estimate to calculate how much work you believe it\'ll take to resolve it. Once you\'ve started to work on a specific issue, log time to keep a record of it.Open the issue and select&nbsp;••• &gt;&nbsp;Time trackingFill in the&nbsp;Time Spent&nbsp;fieldFill in the Time Remaining field and click SaveThat\'s it!💯💯',
        'estimate': 12,
        'timeSpent': 11,
        'timeRemaining': null,
        'createdAt': '2025-01-23T06:54:14.377Z',
        'updatedAt': '2025-01-23T06:54:14.377Z',
        'reporterId': 995860,
        'projectId': 331708,
        'users': [],
        'comments': [
            {
                'id': 2691118,
                'body': 'O snail\nClimb Mount Fuji,\nBut slowly, slowly!',
                'createdAt': '2025-01-23T06:54:14.414Z',
                'updatedAt': '2025-01-23T06:54:14.414Z',
                'userId': 995861,
                'issueId': 2729479,
                'user': {
                    'id': 995861,
                    'name': 'Lord Gaben',
                    'email': 'gaben@jira.guest',
                    'avatarUrl': 'https://i.ibb.co/6RJ5hq6/gaben.jpg',
                    'createdAt': '2025-01-23T06:54:14.316Z',
                    'updatedAt': '2025-01-23T06:54:14.326Z',
                    'projectId': 331708,
                },
            },
        ],
        'userIds': [],
    }
    
    const { user } = useAuth()
    const { query } = useRouter()
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
            notification.error({ message: 'Ошибка' })
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

    const updateTicketTest = () => null

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
                    <AssigneesReporter ticket={ticket} updateTicket={updateTicketAction} employees={employees} />
                    <Priority issue={issue} updateIssue={updateTicketTest} />
                    <Deadline ticket={ticket} updateTicket={updateTicketAction} />
                    <Dates issue={ticket} /> 
                </Right>
            </Content>
        </Fragment>
    )
}


export default ProjectBoardTicketDetails
