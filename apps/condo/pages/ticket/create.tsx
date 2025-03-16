import { Typography, Row, Col } from 'antd'
import { Gutter } from 'antd/es/grid/row'
import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-condo/next/intl'

import { AccessDeniedPage } from '@condo/domains/common/components/containers/AccessDeniedPage'
import { PageContent, PageWrapper } from '@condo/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@condo/domains/common/types'
import { TicketReadAndManagePermissionRequired } from '@condo/domains/ticket/components/PageAccess'
import { TicketForm } from '@condo/domains/ticket/components/TicketForm'


const WRAPPER_GUTTER: Gutter | [Gutter, Gutter] = [0, 60]

const CreateTicketPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitleMsg = intl.formatMessage({ id:'pages.condo.ticket.index.CreateTicketModalTitle' })

    return <AccessDeniedPage/>
}

CreateTicketPage.requiredAccess = TicketReadAndManagePermissionRequired

export default CreateTicketPage
