import useMergeState from '../../hooks/useMergeState'
import { Header } from '../Header'
import Lists from '../Lists/Lists'
import { IFilters } from '../types'

const defaultFilters: IFilters = {
    searchTerm: '',
    userIds: [],
    myOnly: false,
    recent: false,
}

const ProjectBoard = ({ tickets, ticketStatuses, refetchTicket }) => {

    const [filters] = useMergeState(defaultFilters)

    return (
        <>
            <Header />
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
