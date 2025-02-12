import { xor } from 'lodash'
import React, { useMemo } from 'react'

import { useAuth } from '@open-condo/next/auth'
import { useOrganization } from '@open-condo/next/organization'

import {
    Filters,
    Avatars,
    AvatarIsActiveBorder,
    StyledAvatar,
    StyledButton,
    ClearAll,
} from './Styles'

import { OrganizationEmployee } from '../../../organization/utils/clientSchema'
import { Spinner } from '../../ui'

const ProjectBoardFilters = ({ tickets, defaultFilters, filters, mergeFilters }) => {
    const { myOnly, userIds } = filters
    const { organization } = useOrganization()
    const { user } = useAuth()
    const { objs: employeesData, loading: employeesLoading } = OrganizationEmployee.useAllObjects({
        where: {
            organization: { id: organization.id },
            user: { deletedAt: null },
            deletedAt: null,
            isBlocked: false,
            isRejected: false,
        },
    })
    
    const employees = useMemo(() => employeesData?.filter(Boolean) || [], [employeesData])

    const uniqueEmployeesInTickets = useMemo(() => {
        const ticketAssigneesAndExecutors = new Set(
            tickets.flatMap(ticket => [ticket.assignee?.id, ticket.executor?.id])
        )
        return employees.filter(employee => 
            ticketAssigneesAndExecutors.has(employee.user.id) && employee.user.id !== user.id
        )
    }, [tickets, employees])

    const areFiltersCleared = userIds.length === 0 && !myOnly

    if (employeesLoading) { 
        return <Spinner />
    }

    return (
        <Filters>
            <Avatars>
                {uniqueEmployeesInTickets.map((employee, index) => (
                    <AvatarIsActiveBorder
                        key={employee.id}
                        $isactive={userIds.includes(employee.user.id)}
                        $index={index}
                        $total={uniqueEmployeesInTickets.length}
                    >
                        <StyledAvatar
                            size={26}
                            name={employee.user.name}
                            onClick={() => mergeFilters({ userIds: xor(userIds, [employee.user.id]) })}
                        />
                    </AvatarIsActiveBorder>
                )
                )}
            </Avatars>

            <StyledButton
                variant='empty'
                onClick={() => mergeFilters({ myOnly: !myOnly, userIds: [] })}
            >
        Only My Tickets
            </StyledButton>
            {!areFiltersCleared && (
                <ClearAll onClick={() => mergeFilters(defaultFilters)}>Clear all</ClearAll>
            )}
        </Filters>
    )
}

export default ProjectBoardFilters
