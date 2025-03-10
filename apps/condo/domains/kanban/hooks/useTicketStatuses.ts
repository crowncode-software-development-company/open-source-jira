import { useMemo } from 'react'

export const useTicketStatuses = (organization, ticketStatusesData) => {
    return useMemo(() => {
        if (!organization || !ticketStatusesData?.statuses) {
            return { statuses: [], isLoading: true }
        }

        const statusTransitions = organization.statusTransitions || {}
        const keys = Object.keys(statusTransitions)
        
        const orderedStatusIds = getOrderedStatuses(statusTransitions, keys[1])
        console.log(orderedStatusIds)
        
        const statuses = orderedStatusIds
            .map(statusId => {
                const status = ticketStatusesData.statuses.find(s => s.id === statusId)
                if (status) {
                    return {
                        [status.name]: { 
                            id: status.id,
                            colors: {
                                primary: status.colors.primary,
                                secondary: status.colors.secondary,
                            },
                        },
                    }
                }
                return null
            })
            .filter(Boolean) 
            .reduce((acc, curr) => Object.assign(acc, curr), {})
    
        console.log(statuses)
            

        return { statuses }
    }, [organization, ticketStatusesData])
}

function getOrderedStatuses (statusTransitions, startStatus) {
    const visited = new Set()
    const orderedStatuses = []

    function dfs (status) {
        if (visited.has(status)) return
        visited.add(status)
        orderedStatuses.push(status)

        const transitions = statusTransitions[status]
        if (transitions) {
            for (const nextStatus of transitions) {
                dfs(nextStatus)
            }
        }
    }

    dfs(startStatus)

    return orderedStatuses
}
