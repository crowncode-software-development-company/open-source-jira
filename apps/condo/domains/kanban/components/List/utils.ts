export const filterTickets = (projectTickets, filters, userId) => {
    const { userIds, myOnly } = filters
    let tickets = projectTickets

    if (userIds.length > 0) {
        tickets = tickets.filter(ticket => 
            userIds.includes(ticket.assignee.id) || 
            userIds.includes(ticket.executor.id)
        )
    }
    if (myOnly && userId) {
        tickets = tickets.filter(ticket => (ticket.assignee.id  === userId || ticket.executor.id  === userId))
    }
    return tickets
}

export const getSortedListTickets = (ticket, status) => ticket.filter(ticket => ticket.status.name === status).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA
})

export const formatTicketsCount = (allListIssues, filteredListIssues, TicketsOfTitle) => {
    if (allListIssues.length !== filteredListIssues.length) {
        return `${filteredListIssues.length} ${TicketsOfTitle} ${allListIssues.length}`
    }
    return allListIssues.length
}