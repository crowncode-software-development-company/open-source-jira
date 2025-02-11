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

const ProjectBoard = ({ tickets, ticketStatuses, refetchTicket }) => {

    const [filters, mergeFilters] = useMergeState(defaultFilters)

    return (
        <>
            <HeaderContainer>
                <Header />
                <Filters 
                    defaultFilters={defaultFilters}
                    filters={filters}
                    mergeFilters={mergeFilters}/>
            </HeaderContainer>
            <Lists
                tickets={tickets}
                filters={filters}
                refetch={refetchTicket}
                ticketStatuses={ticketStatuses}
            />
        </>
    )
}

export default ProjectBoard
