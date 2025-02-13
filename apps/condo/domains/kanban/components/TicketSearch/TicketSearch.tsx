import { useRouter } from 'next/router'
import React, { Fragment, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import { Search } from '@open-condo/icons'
import { useOrganization } from '@open-condo/next/organization'

import {
    TicketSearch,
    SearchInputCont,
    SearchInputDebounced,
    SearchSpinner,
    Ticket,
    TicketData,
    TicketTitleText,
    TicketTypeId,
    SectionTitle,
    NoResults,
    NoResultsTitle,
    NoResultsTip,
    TicketLink,
    NumberTicket,
    TicketTypeColor,
    TicketDataContainer,
} from './Styles'

import { useGetTicketsQuery } from '../../../../gql'
import { color } from '../../styles'
import { Avatar, TicketTypeIcon } from '../../ui'
import { sortByNewest } from '../../utils'

const ProjectTicketSearch = () => {
    const intl = useIntl()
    const TicketTitle = intl.formatMessage({ id: 'Ticket' })
    const SearchTitle = intl.formatMessage({ id: 'kanban.ticket.searchTicket.placeholder' })
    const RecentTicketTitle = intl.formatMessage({ id: 'kanban.ticket.recentTicket.title' })
    const MatchingTicketTitle = intl.formatMessage({ id: 'kanban.ticket.matchingTicket.title' })
    const NoResultTitle = intl.formatMessage({ id: 'kanban.ticket.noResults.title' })
    const NoResultTipTitle = intl.formatMessage({ id: 'kanban.ticket.noResults.Tip.title' })
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
                    { details_contains_i: searchValue },
                    { number: +searchValue  }, 
                    { classifier: { category: { name_contains_i: searchValue } } }, 
                    { classifier: { place: { name_contains_i: searchValue } } },
                    { assignee: { name_contains_i: searchValue  } },
                    { executor: { name_contains_i: searchValue  } },
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
            <Ticket>
                <TicketTypeIcon size='large' type='task'/>
                <TicketDataContainer>
                    <TicketData>
                        <TicketTitleText><NumberTicket>{TicketTitle} №{ticket.number}</NumberTicket> / {ticket.classifier.category.name} 🠖 {ticket.classifier.place.name}</TicketTitleText>
                        <TicketTypeId>
                            <TicketTypeColor $color={ticket.status.colors.primary}>{ticket.status.name}</TicketTypeColor> / {ticket.assignee.name}
                        </TicketTypeId>
                    </TicketData>
                    <Avatar name={ticket.assignee.name} size={30}/>
                </TicketDataContainer>
            </Ticket>
        </TicketLink>
    )

    return (
        <TicketSearch>
            <SearchInputCont>
                <SearchInputDebounced
                    autoFocus
                    value={searchValue} 
                    placeholder={SearchTitle}
                    onChange={handleSearchChange}
                />
                {isTicketsFetching && <SearchSpinner />}
            </SearchInputCont>

            {isSearchTermEmpty && recentTicket.length > 0 && (
                <Fragment>
                    <SectionTitle>{RecentTicketTitle}</SectionTitle>
                    {recentTicket.map(renderTicket)}
                </Fragment>
            )}

            {!isSearchTermEmpty && tickets.length > 0 && (
                <Fragment>
                    <SectionTitle>{MatchingTicketTitle}</SectionTitle>
                    {tickets.map(renderTicket)}
                </Fragment>
            )}

            {!isSearchTermEmpty && !isTicketsFetching && tickets.length === 0 && (
                <NoResults>
                    <Search size='large' color={color.textMedium} />
                    <NoResultsTitle>{NoResultTitle}</NoResultsTitle>
                    <NoResultsTip>{NoResultTipTitle}</NoResultsTip>
                </NoResults>
            )}
        </TicketSearch>
    )
}
export default ProjectTicketSearch