import { Typography, Row, Col } from 'antd'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import { useIntl } from '@open-condo/next/intl'

import { AccessDeniedPage } from '@condo/domains/common/components/containers/AccessDeniedPage'
import { PageContent, PageWrapper } from '@condo/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@condo/domains/common/types'
import { TicketReadAndManagePermissionRequired } from '@condo/domains/ticket/components/PageAccess'
import { TicketForm } from '@condo/domains/ticket/components/TicketForm'
import { prefetchTicket } from '@condo/domains/ticket/utils/next/Ticket'


const TicketUpdatePage: PageComponentType = () => {
    return <AccessDeniedPage/>
}

TicketUpdatePage.requiredAccess = TicketReadAndManagePermissionRequired

TicketUpdatePage.getPrefetchedData = async ({ context, apolloClient }) => {
    const { query } = context
    const { id: ticketId } = query as { id: string }

    await prefetchTicket({ client: apolloClient, ticketId })

    return {
        props: {},
    }
}

export default TicketUpdatePage
