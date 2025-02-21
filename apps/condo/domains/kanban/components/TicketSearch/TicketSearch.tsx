import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
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
    Avatars,
    StyledAvatar,
} from './Styles'

import { useGetTicketsQuery } from '../../../../gql'
import { color } from '../../styles'
import { TicketTypeIcon } from '../../ui'
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
    const [isSearchTermEmpty, setIsSearchTermEmpty] = useState(!getSearchTerm)
    const [searchValue, setSearchValue] = useState(getSearchTerm)

    function getSearchTerm () {
        const searchTerm = router.query['search-term']
        return Array.isArray(searchTerm) ? searchTerm[0] : searchTerm || ''
    }

    useEffect(() => {
        const currentSearchValue = getSearchTerm()
        setSearchValue(currentSearchValue)
        setIsSearchTermEmpty(!currentSearchValue)
    }, [router.query['search-modal']])

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
        if (value.trim() === '') {
            setIsSearchTermEmpty(true)
            router.push('kanban?search-modal=true', undefined, { shallow: true })
        } else {
            setIsSearchTermEmpty(false)
            router.push(`kanban?search-modal=true&search-term=${value}`, undefined, { shallow: true })
        }
        await refetch()
    }

    const handleOpenModal = (id) => {
        router.push(`/kanban?ticketId=${id}`, undefined, { shallow: true })
    }
   
    const recentTicket = sortByNewest(tickets, 'createdAt').slice(0, 10)
    
    const renderTicket = (ticket, index) =>  (
        <TicketLink
            key={index}
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
                    <Avatars>
                        <StyledAvatar name={ticket.assignee.name} size={30}/>
                        <StyledAvatar name={ticket.executor.name} size={30}/>
                    </Avatars>
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
                <>
                    <SectionTitle>{RecentTicketTitle}</SectionTitle>
                    {recentTicket.map((tickets, index) => renderTicket(tickets, index))}
                </>
            )}

            {!isSearchTermEmpty && tickets.length > 0 && (
                <>
                    <SectionTitle>{MatchingTicketTitle}</SectionTitle>
                    {tickets.map((tickets, index) => renderTicket(tickets, index))}
                </>
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