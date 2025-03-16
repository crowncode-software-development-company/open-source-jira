import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-condo/next/intl'
import { Typography } from '@open-condo/ui'

import { AccessDeniedPage } from '@condo/domains/common/components/containers/AccessDeniedPage'
import { PageContent, PageHeader, PageWrapper } from '@condo/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@condo/domains/common/types'
import { EmployeeRoleForm } from '@condo/domains/organization/components/EmployeeRoleForm'
import { EmployeeRolesReadAndManagePermissionRequired } from '@condo/domains/settings/components/PageAccess'


const CreateEmployeeRolePage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'pages.condo.employeeRole.create.title' })

    return <AccessDeniedPage />
}

CreateEmployeeRolePage.requiredAccess = EmployeeRolesReadAndManagePermissionRequired

export default CreateEmployeeRolePage
