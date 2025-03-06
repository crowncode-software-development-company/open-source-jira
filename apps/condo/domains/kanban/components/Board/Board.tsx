import { useMemo } from 'react'
import styled from 'styled-components'

import { useOrganization } from '@open-condo/next/organization'

import { useGetTicketStatusesQuery } from '../../../../gql'
import { Loader } from '../../../common/components/Loader'
import useMergeState from '../../hooks/useMergeState'
import { useTicketStatuses } from '../../hooks/useTicketStatuses'
import Filters from '../Filters/Filters'
import { Header } from '../Header'
import Lists from '../Lists/Lists'
import { IFilters } from '../types'

const defaultFilters: IFilters = {
    userIds: [],
    myOnly: false,
}

const HeaderContainer = styled.div`
  display: flex;
  justify-content: row;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
`

const ProjectBoard = ({ tickets, refetchAllTickets }) => {

    const [filters, mergeFilters] = useMergeState(defaultFilters)
    const { organization } = useOrganization()
    const {
        loading: isStatusesFetching,
        data: ticketStatusesData,
    } = useGetTicketStatusesQuery()

    const { statuses } = useTicketStatuses(organization, ticketStatusesData)

    return (
        <>
            <HeaderContainer>
                <Header />
                {tickets.length > 0 && 
                <Filters 
                    tickets={tickets}
                    defaultFilters={defaultFilters}
                    filters={filters}
                    mergeFilters={mergeFilters}/>}
            </HeaderContainer>
            
            {isStatusesFetching ? <Loader fill size='default'/> : <Lists
                tickets={tickets}
                filters={filters}
                refetchAllTickets={refetchAllTickets}
                ticketStatuses={statuses}
            />}
        </>
    )
}

export default ProjectBoard
