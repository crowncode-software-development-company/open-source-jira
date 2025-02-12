import { Modal, Row } from 'antd'
import { Gutter } from 'antd/es/grid/row'
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
import ProjectBoardTicketDetails from '@condo/domains/kanban/components/TicketDetails'
import ProjectTicketSearch from '@condo/domains/kanban/components/TicketSearch/TicketSearch'
import { CreateTicketForm } from '@condo/domains/ticket/components/TicketForm/CreateTicketForm'

import { useGetTicketsQuery, useGetTicketStatusesQuery } from '../../gql'

const WRAPPER_GUTTER: Gutter | [Gutter, Gutter] = [0, 60]

export const KanbanPageContent = ({ organizationId, tickets, ticketStatuses, refetchAllTickets }) => {
    const router = useRouter()
    const [isTicketOpen, setTicketOpen] = useState(false)
    const [isCreateTicketOpen, setCreateTicketOpen] = useState(false)
    const [isSearchTicketOpen, setSearchTicketOpen] = useState(false)
    const [ticketKey, setTicketKey] = useState(0)
    const { query } = router

    useEffect(() => {
        if (query.ticketId && !isTicketOpen && !isCreateTicketOpen) {  
            setSearchTicketOpen(false)
            setTicketOpen(true)
        } else if (query['create-modal']) {
            setCreateTicketOpen(true)
        } else if (query['search-modal']) {
            setSearchTicketOpen(true)
        }
    }, [router.query]) 

    const handleCloseModals = () => {
        setCreateTicketOpen(false)
        setTicketOpen(false)
        setTicketKey(prevKey => prevKey + 1)
        setSearchTicketOpen(false)
        router.push('/kanban', undefined, { shallow: true })
    }
    
    return (
        <>
            <Modal width={1040} open={isCreateTicketOpen} onCancel={handleCloseModals} footer={null} style={{ top: 20 }} closable={false} transitionName=''>
                <Row gutter={WRAPPER_GUTTER}>
                    <CreateTicketForm closeModal={handleCloseModals}/>
                </Row>
            </Modal>

            <Modal width={720} open={isSearchTicketOpen} onCancel={handleCloseModals} footer={null} style={{ top: 20 }} transitionName=''>
                <ProjectTicketSearch />
            </Modal>

            <Modal width={1040} open={isTicketOpen} onCancel={handleCloseModals} footer={null} style={{ top: 20 }} closable={false} transitionName=''>
                <ProjectBoardTicketDetails organizationId={organizationId} ticketStatuses = {ticketStatuses} modalClose = {handleCloseModals} refetchTicketsBoard={refetchAllTickets}/>
            </Modal>

            
            <ProjectBoard tickets={tickets} ticketStatuses={ticketStatuses} refetchAllTickets={refetchAllTickets}/>
        </>
    )
}


const KanbanPage: PageComponentType = () => {
    const { organization } = useOrganization()
    const intl = useIntl()

    const kanbanTitle = intl.formatMessage({ id: 'kanban.title' })

    const {
        loading: isTicketsFetching,
        data: ticketsData,
        refetch: refetchAllTickets,
    } = useGetTicketsQuery({
        variables: {
            where: { organization: { id: organization.id } },
        },
        fetchPolicy: 'network-only',
    })
    const tickets = useMemo(() => ticketsData?.tickets?.filter(Boolean) || [], [ticketsData?.tickets])
    
    const {
        loading: isStatusesFetching,
        data: ticketStatusesData,
    } = useGetTicketStatusesQuery()

    const ticketStatuses = useMemo(() => {
        return ticketStatusesData?.statuses?.filter(Boolean).reduce((acc, status) => {
            acc[status.name] = { id: status.id, colors: { primary: status.colors.primary, secondary: status.colors.secondary } }
            return acc
        }, {}) || {}
    }, [ticketStatusesData?.statuses])

    if (isTicketsFetching || isStatusesFetching) {
        return (
            <LoadingOrErrorPage
                loading={isTicketsFetching || isStatusesFetching}
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
                    <KanbanPageContent organizationId={organization.id} tickets={tickets} ticketStatuses={ticketStatuses} refetchAllTickets={refetchAllTickets}/>
                </PageContent>
            </PageWrapper>
        </>
    )
}

export default KanbanPage
