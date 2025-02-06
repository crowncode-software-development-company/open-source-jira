import React, { useState } from 'react'

import { Copy } from '@open-condo/icons'

import { Button } from '../../ui'
import { copyToClipboard } from '../../utils'

const CopyLinkButton = ({ ...buttonProps }) => {
    const [isLinkCopied, setLinkCopied] = useState(false)

    const handleLinkCopy = () => {
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
        copyToClipboard(window.location.href)
    }

    return (
        <Button icon={<Copy size='small'/>} onClick={handleLinkCopy} {...buttonProps}>
            {isLinkCopied ? 'Link Copied' : 'Copy link'}
        </Button>
    )
}

export default CopyLinkButton
