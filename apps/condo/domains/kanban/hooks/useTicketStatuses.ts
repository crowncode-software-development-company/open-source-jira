import { useMemo } from 'react'

export const useTicketStatuses = (organization, ticketStatusesData) => {
    return useMemo(() => {
        if (!organization || !ticketStatusesData?.statuses) {
            return { statuses: {}, isLoading: true }
        }

        const statusTransitions = organization.statusTransitions || {}
        const uniqueStatusIds = new Set()

        for (const key in statusTransitions) {
            if (Array.isArray(statusTransitions[key])) {
                statusTransitions[key].forEach(id => uniqueStatusIds.add(id))
            }
        }

        const statuses = ticketStatusesData.statuses
            .filter(status => status && uniqueStatusIds.has(status.id))
            .reduce((acc, status) => {
                acc[status.name] = {
                    id: status.id,
                    colors: {
                        primary: status.colors.primary,
                        secondary: status.colors.secondary,
                    },
                }
                return acc
            }, {})

        return { statuses }
    }, [organization, ticketStatusesData])
}