import { Modal } from 'antd'
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
    const [isTicketOpen, setTicketOpen] = useState(false)
    const [isCreateTicketOpen, setCreateTicketOpen] = useState(false)
    const [isSearchTicketOpen, setSearchTicketOpen] = useState(false)
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
        setSearchTicketOpen(false)
        router.push('/kanban', undefined, { shallow: true })
    }
    
    return (
        <>
            <Modal zIndex={100} width={1040} open={isCreateTicketOpen} onCancel={handleCloseModals} closable={false} footer={null} style={{ top: 10, padding: 5 }} transitionName=''>
                <ProjectTicketCreate ticketsCount={tickets.length} closeModal={handleCloseModals} refetchTicketsBoard={refetchAllTickets}/>
            </Modal>

            <Modal zIndex={100} width={720} open={isSearchTicketOpen} onCancel={handleCloseModals} footer={null} style={{ top: 20 }} transitionName=''>
                <ProjectTicketSearch/>
            </Modal>

            <Modal zIndex={100} width={1040} open={isTicketOpen} onCancel={handleCloseModals} footer={null} style={{ top: 20 }} closable={false} transitionName=''>
                <ProjectBoardTicketDetails handleCloseModals = {handleCloseModals} refetchTicketsBoard={refetchAllTickets}/>
            </Modal>
            
            <ProjectBoard tickets={tickets} refetchAllTickets={refetchAllTickets}/>
        </>
    )
}


const KanbanPage: PageComponentType = () => {
    const { organization } = useOrganization()
    const intl = useIntl()

    const kanbanTitle = intl.formatMessage({ id: 'kanban.title.description' })
    const {
        loading: isTicketsFetching,
        data: ticketsData,
        refetch: refetchAllTickets,
    } = useGetTicketsQuery({
        variables: {
            where: {
                organization: { id: organization.id },
                // OR: [
                //     {
                //         status: { id_not: 'f0fa0093-8d86-4e69-ae1a-70a2914da82f' },
                //     },
                //     {
                //         status: { id: 'f0fa0093-8d86-4e69-ae1a-70a2914da82f' },
                //         updatedAt_gte: new Date(Date.now()).toISOString(),
                //     },
                // ],
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
