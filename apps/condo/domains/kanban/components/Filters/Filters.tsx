import { xor } from 'lodash'
import React, { useMemo } from 'react'

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

const ProjectBoardFilters = ({ defaultFilters, filters, mergeFilters }) => {
    const { myOnly, userIds } = filters
    const { organization } = useOrganization()

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
    const areFiltersCleared = userIds.length === 0 && !myOnly

    if (employeesLoading) {
        return <Spinner />
    }

    return (
        <Filters>
            <Avatars>
                {employees.map((employee, index) => (
                    <AvatarIsActiveBorder
                        key={employee.id}
                        $isactive={userIds.includes(employee.user.id)}
                        $index={index}
                        $total={employees.length}
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
