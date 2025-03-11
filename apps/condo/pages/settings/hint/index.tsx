import get from 'lodash/get'
import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-condo/next/intl'
import { useOrganization } from '@open-condo/next/organization'

import { AccessDeniedPage } from '@condo/domains/common/components/containers/AccessDeniedPage'
import { PageContent, PageWrapper } from '@condo/domains/common/components/containers/BaseLayout'
import { usePreviousSortAndFilters } from '@condo/domains/common/hooks/usePreviousQueryParams'
import { PageComponentType } from '@condo/domains/common/types'
import { SettingsReadPermissionRequired } from '@condo/domains/settings/components/PageAccess'
import {
    SettingsContent as TicketPropertyHintSettings,
} from '@condo/domains/ticket/components/TicketPropertyHint/SettingsContent'


const PropertyHintsPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'Hint' })

    const { link }  = useOrganization()
    const employeeId = get(link, 'id')
    usePreviousSortAndFilters({ employeeSpecificKey: employeeId })

    return <AccessDeniedPage />
}

PropertyHintsPage.requiredAccess = SettingsReadPermissionRequired

export default PropertyHintsPage
