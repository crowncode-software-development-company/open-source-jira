import styled from 'styled-components'

import useMergeState from '../../hooks/useMergeState'
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

const ProjectBoard = ({ tickets, ticketStatuses, refetchAllTickets }) => {

    const [filters, mergeFilters] = useMergeState(defaultFilters)

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
            <Lists
                tickets={tickets}
                filters={filters}
                refetchAllTickets={refetchAllTickets}
                ticketStatuses={ticketStatuses}
            />
        </>
    )
}

export default ProjectBoard
