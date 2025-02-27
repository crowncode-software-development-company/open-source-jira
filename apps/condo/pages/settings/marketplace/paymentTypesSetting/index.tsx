import React from 'react'

import { AccessDeniedPage } from '@condo/domains/common/components/containers/AccessDeniedPage'
import { PageComponentType } from '@condo/domains/common/types'
import {
    MarketSettingReadPermissionRequired,
} from '@condo/domains/settings/components/PageAccess'

const PaymentTypesSettingPage: PageComponentType = () => {
    return (
        <AccessDeniedPage/>
    )
}

PaymentTypesSettingPage.requiredAccess = MarketSettingReadPermissionRequired

export default PaymentTypesSettingPage
