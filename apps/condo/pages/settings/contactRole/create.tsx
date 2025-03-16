import { Col, Row, Typography } from 'antd'
import { Gutter } from 'antd/es/grid/row'
import Head from 'next/head'
import React, { CSSProperties } from 'react'

import { useIntl } from '@open-condo/next/intl'

import { AccessDeniedPage } from '@condo/domains/common/components/containers/AccessDeniedPage'
import { PageContent, PageWrapper } from '@condo/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@condo/domains/common/types'
import { ContactRoleForm } from '@condo/domains/contact/components/contactRoles/ContactRoleForm'
import { SettingsReadPermissionRequired } from '@condo/domains/settings/components/PageAccess'


const TITLE_STYLES: CSSProperties = { margin: 0 }
const BIG_VERTICAL_GUTTER: [Gutter, Gutter] = [0, 60]

const CreateContactRolePage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitleMsg = intl.formatMessage({ id: 'ContactRoles.createRoleTitle' })

    return <AccessDeniedPage />
}

CreateContactRolePage.requiredAccess = SettingsReadPermissionRequired

export default CreateContactRolePage
