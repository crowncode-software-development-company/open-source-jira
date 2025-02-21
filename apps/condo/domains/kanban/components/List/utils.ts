export const filterTickets = ({ projectTickets, filters, userId }) => {
    const { userIds, myOnly } = filters

    return projectTickets.filter(ticket => {
        const isUserIncluded = userIds.length === 0 || userIds.includes(ticket.assignee.id) || userIds.includes(ticket.executor.id)
        const isMyTicket = !myOnly || (userId && (ticket.assignee.id === userId || ticket.executor.id === userId))

        return isUserIncluded && isMyTicket
    })
}

export const getSortedListTickets = (ticket, status) => ticket.filter(ticket => ticket.status.name === status).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA
})

export const formatTicketsCount = (allListTickets, filteredListTickets, TicketsOfTitle) => {
    if (allListTickets.length !== filteredListTickets.length) {
        return `${filteredListTickets.length} ${TicketsOfTitle} ${allListTickets.length}`
    }
    return allListTickets.length
}