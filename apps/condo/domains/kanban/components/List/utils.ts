import { intersection } from 'lodash'
import moment from 'moment'
import { useIntl } from 'react-intl'

export const filterIssues = (projectIssues, filters, currentUserId) => {
    const { searchTerm, userIds, myOnly, recent } = filters
    let issues = projectIssues

    if (searchTerm) {
        issues = issues.filter(issue => issue.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (userIds.length > 0) {
        issues = issues.filter(issue => intersection(issue.userIds, userIds).length > 0)
    }
    if (myOnly && currentUserId) {
        issues = issues.filter(issue => issue.userIds.includes(currentUserId))
    }
    if (recent) {
        issues = issues.filter(issue => moment(issue.updatedAt).isAfter(moment().subtract(3, 'days')))
    }
    return issues
}

export const getSortedListTickets = (issues, status) => issues.filter(issue => issue.status.name === status).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA
})

export const formatTicketsCount = (allListIssues, filteredListIssues) => {
    if (allListIssues.length !== filteredListIssues.length) {
        return `${filteredListIssues.length} of ${allListIssues.length}`
    }
    return allListIssues.length
}