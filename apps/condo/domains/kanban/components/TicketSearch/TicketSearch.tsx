import { useRouter } from 'next/router'
import React, { Fragment, useMemo, useState } from 'react'

import { useOrganization } from '@open-condo/next/organization'

import {
    TicketSearch,
    SearchInputCont,
    SearchInputDebounced,
    SearchSpinner,
    Ticket,
    TicketData,
    TicketTitle,
    TicketTypeId,
    SectionTitle,
    NoResults,
    NoResultsTitle,
    NoResultsTip,
    TicketLink,
    NumberTicket,
    TicketTypeColor,
} from './Styles'

import { useGetTicketsQuery } from '../../../../gql'
import { NoResult } from '../../icons'
import { TicketTypeIcon } from '../../ui'
import { sortByNewest } from '../../utils'

const ProjectTicketSearch = () => {
    const router = useRouter()
    const { organization } = useOrganization()
    const [isSearchTermEmpty, setIsSearchTermEmpty] = useState(true)
    const [searchValue, setSearchValue] = useState('')

    const {
        loading: isTicketsFetching,
        data: ticketsData,
        refetch,
    } = useGetTicketsQuery({
        variables: {
            where: { 
                organization: { id: organization.id },
                OR: [
                    { details_contains: searchValue },
                    { number: +searchValue  }, 
                    { classifier: { category: { name_contains: searchValue } } }, 
                    { classifier: { place: { name_contains: searchValue } } },
                    { assignee: { name_contains: searchValue  } },
                    { executor: { name_contains: searchValue  } },
                ],
            },
        },
        skip: !router.query['search-modal'],
        fetchPolicy: 'network-only',
    })
    const tickets = useMemo(() => ticketsData?.tickets?.filter(Boolean) || [], [ticketsData?.tickets])

    const handleSearchChange = async (value) => {
        setSearchValue(value)
        setIsSearchTermEmpty(value.trim() === '' ? true : false)
        await refetch()
    }

    const handleOpenModal = (id) => {
        router.push(`/kanban?ticketId=${id}`, undefined, { shallow: true })
    }
   
    const recentTicket = sortByNewest(tickets, 'createdAt').slice(0, 10)
    
    const renderTicket = (ticket) =>  (
        <TicketLink
            onClick={() => handleOpenModal(ticket.id)}>
            <Ticket >
                <TicketTypeIcon size='large' type='task'/>
                <TicketData>
                    <TicketTitle><NumberTicket>Заявка №{ticket.number}</NumberTicket> / {ticket.classifier.category.name} 🠖 {ticket.classifier.place.name}</TicketTitle>
                    <TicketTypeId><TicketTypeColor $color={ticket.status.colors.primary}>{ticket.status.name}</TicketTypeColor> / {ticket.assignee.name}</TicketTypeId>
                </TicketData>
            </Ticket>
        </TicketLink>
    )

    return (
        <TicketSearch>
            <SearchInputCont>
                <SearchInputDebounced
                    autoFocus
                    value={searchValue} 
                    placeholder='Search ticket by description...'
                    onChange={handleSearchChange}
                />
                {isTicketsFetching && <SearchSpinner />}
            </SearchInputCont>

            {isSearchTermEmpty && recentTicket.length > 0 && (
                <Fragment>
                    <SectionTitle>Recent Tickets</SectionTitle>
                    {recentTicket.map(renderTicket)}
                </Fragment>
            )}

            {!isSearchTermEmpty && tickets.length > 0 && (
                <Fragment>
                    <SectionTitle>Matching Tickets</SectionTitle>
                    {tickets.map(renderTicket)}
                </Fragment>
            )}

            {!isSearchTermEmpty && !isTicketsFetching && tickets.length === 0 && (
                <NoResults>
                    <NoResult size='large' />
                    <NoResultsTitle>We couldn&apos;t find anything matching your search</NoResultsTitle>
                    <NoResultsTip>Try again with a different term.</NoResultsTip>
                </NoResults>
            )}
        </TicketSearch>
    )
}
export default ProjectTicketSearch