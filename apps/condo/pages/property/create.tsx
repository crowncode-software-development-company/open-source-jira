import { Typography, Row, Col, RowProps } from 'antd'
import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-condo/next/intl'
import { Tour } from '@open-condo/ui'

import { AccessDeniedPage } from '@condo/domains/common/components/containers/AccessDeniedPage'
import { PageContent, PageWrapper } from '@condo/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@condo/domains/common/types'
import { OrganizationRequired } from '@condo/domains/organization/components/OrganizationRequired'
import { PropertyForm } from '@condo/domains/property/components/PropertyForm'


const PROPERTY_CREATE_PAGE_GUTTER: RowProps['gutter'] = [0, 40]
const PROPERTY_CREATE_PAGE_TITLE_STYLE: React.CSSProperties = { margin: 0 }

const CreatePropertyPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitleMsg = intl.formatMessage({ id: 'pages.condo.property.index.CreatePropertyTitle' })

    return <AccessDeniedPage/>
}

CreatePropertyPage.requiredAccess = OrganizationRequired

export default CreatePropertyPage
