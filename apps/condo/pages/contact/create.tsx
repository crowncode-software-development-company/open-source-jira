import { Typography, Row, Col } from 'antd'
import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-condo/next/intl'

import { AccessDeniedPage } from '@condo/domains/common/components/containers/AccessDeniedPage'
import { PageContent, PageWrapper } from '@condo/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@condo/domains/common/types'
import { CreateContactForm } from '@condo/domains/contact/components/CreateContactForm'
import { ContactsReadAndManagePermissionRequired } from '@condo/domains/contact/components/PageAccess'


const CreateContactPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'contact.AddContact' })

    return <AccessDeniedPage/>
}

CreateContactPage.requiredAccess = ContactsReadAndManagePermissionRequired

export default CreateContactPage
