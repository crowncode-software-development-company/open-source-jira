import { Modal } from 'antd'
import dayjs from 'dayjs'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import { useOrganization } from '@open-condo/next/organization'
import { Typography } from '@open-condo/ui'

import { PageContent, PageHeader, PageWrapper } from '@condo/domains/common/components/containers/BaseLayout'
import LoadingOrErrorPage from '@condo/domains/common/components/containers/LoadingOrErrorPage'
import { PageComponentType } from '@condo/domains/common/types'
import { ProjectBoard } from '@condo/domains/kanban/components/Board'
import ProjectTicketCreate from '@condo/domains/kanban/components/TicketCreate/TicketCreate'
import ProjectBoardTicketDetails from '@condo/domains/kanban/components/TicketDetails'
import ProjectTicketSearch from '@condo/domains/kanban/components/TicketSearch/TicketSearch'

import { useGetTicketsQuery } from '../../gql'
import { SortTicketsBy } from '../../schema'

export const KanbanPageContent = ({ tickets, refetchAllTickets }) => {
    const router = useRouter()
    const [isTicketOpen, setIsTicketOpen] = useState(false)
    const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)
    const [isSearchTicketOpen, setIsSearchTicketOpen] = useState(false)
    const { query } = router

    useEffect(() => {
        if (query.ticketId && !isTicketOpen && !isCreateTicketOpen) {  
            setIsSearchTicketOpen(false)
            setIsTicketOpen(true)
        } else if (query['create-modal']) {
            setIsCreateTicketOpen(true)
        } else if (query['search-modal']) {
            setIsSearchTicketOpen(true)
        }
    }, [router.query]) 

    const handleCloseModals = () => {
        setIsCreateTicketOpen(false)
        setIsTicketOpen(false)
        setIsSearchTicketOpen(false)
        router.push('/kanban', undefined, { shallow: true })
    }
    
    return (
        <>
            <Modal zIndex={100} width={1040} open={isCreateTicketOpen} onCancel={handleCloseModals} closable={false} footer={null} style={{ top: 10, padding: 5 }} transitionName=''>
                <ProjectTicketCreate closeModal={handleCloseModals} refetchTicketsBoard={refetchAllTickets}/>
            </Modal>

            <Modal zIndex={100} width={720} open={isSearchTicketOpen} onCancel={handleCloseModals} footer={null} style={{ top: 20 }} transitionName=''>
                <ProjectTicketSearch/>
            </Modal>

            <Modal zIndex={100} width={1040} open={isTicketOpen} onCancel={handleCloseModals} footer={null} style={{ minWidth: 600, top: 20 }} closable={false} transitionName=''>
                <ProjectBoardTicketDetails handleCloseModals = {handleCloseModals} refetchTicketsBoard={refetchAllTickets}/>
            </Modal>
            
            <ProjectBoard tickets={tickets} refetchAllTickets={refetchAllTickets}/>
        </>
    )
}


const DEFERRED_STATUS_ID = 'c14a58e0-6b5d-4ec2-b91c-980a90509c7f'
const CANCELED_STATUS_ID = 'f0fa0093-8d86-4e69-ae1a-70a2914da82f'
const COMPLETED_STATUS_ID = '5b9decd7-792c-42bb-b16d-822142fd2d69'
const KanbanPage: PageComponentType = () => {
    const { organization } = useOrganization()
    const intl = useIntl()

    const kanbanTitle = intl.formatMessage({ id: 'kanban.title.description' })
    
    const newDate = useMemo(() => {
        return dayjs().subtract(7, 'day').toDate()
    }, [])

    const statuses = [
        DEFERRED_STATUS_ID,
        CANCELED_STATUS_ID,
        COMPLETED_STATUS_ID,
    ]

    const notInStatusConditions = statuses.map(status => ({
        status: { id_not: status },
    }))

    const inStatusConditions = statuses.map(status => ({
        AND: [
            { status: { id: status } },
            { updatedAt_gte: newDate.toISOString() },
        ],
    }))


    const {
        loading: isTicketsFetching,
        data: ticketsData,
        refetch: refetchAllTickets,
    } = useGetTicketsQuery({
        variables: {
            where: {
                organization: { id: organization.id },
                OR: [
                    {
                        AND: notInStatusConditions,
                    },
                    {
                        OR: inStatusConditions,
                    },
                ],
            },
            sortBy: SortTicketsBy.CreatedAtDesc,
            first: 50,
        },
        fetchPolicy: 'network-only',
    })
    const tickets = useMemo(() => ticketsData?.tickets?.filter(Boolean) || [], [ticketsData?.tickets])

    if (isTicketsFetching) {
        return (
            <LoadingOrErrorPage
                loading={isTicketsFetching }
            />
        )
    }
    
    return (
        <>
            <Head>
                <title>{kanbanTitle}</title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <PageHeader
                        title={
                            <Typography.Title>{kanbanTitle}</Typography.Title>
                        }
                    />
                    <KanbanPageContent tickets={tickets} refetchAllTickets={refetchAllTickets}/>
                </PageContent>
            </PageWrapper>
        </>
    )
}

export default KanbanPage
