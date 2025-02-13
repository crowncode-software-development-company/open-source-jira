import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import { Copy } from '@open-condo/icons'

import { Button } from '../../ui'
import { copyToClipboard } from '../../utils'

const CopyLinkButton = ({ ...buttonProps }) => {
    const intl = useIntl()
    const CopyLinkTitle = intl.formatMessage({ id: 'pages.condo.marketplace.invoice.form.create.notification.copyLink' })
    const CopiedLinkTitle = intl.formatMessage({ id: 'pages.condo.marketplace.invoice.form.create.notification.copiedLink' })
    const [isLinkCopied, setLinkCopied] = useState(false)

    const handleLinkCopy = () => {
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
        copyToClipboard(window.location.href)
    }

    return (
        <Button icon={<Copy size='small'/>} onClick={handleLinkCopy} {...buttonProps}>
            {isLinkCopied ? CopiedLinkTitle : CopyLinkTitle}
        </Button>
    )
}

export default CopyLinkButton
