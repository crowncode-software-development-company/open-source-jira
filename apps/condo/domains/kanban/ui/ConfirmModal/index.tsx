import { Modal, Button } from 'antd'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'

interface ConfirmModalProps {
    className?: string
    title: string
    message: string | React.ReactNode
    confirmText: string
    cancelText?: string
    onConfirm: (options: { close: () => void }) => void
    renderLink: (options: { open: () => void }) => React.ReactNode
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    className,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    renderLink,
}) => {
    const [isWorking, setWorking] = useState(false)
    const [visible, setVisible] = useState(false)
    const intl = useIntl()
    const CancelTitle = intl.formatMessage({ id: 'Cancel' })

    const handleConfirm = () => {
        setWorking(true)
        onConfirm({
            close: () => {
                setVisible(false)
                setWorking(false)
            },
        })
    }

    const showModal = () => {
        setVisible(true)
    }

    const handleCancel = () => {
        setVisible(false)
    }

    return (
        <>
            {renderLink({ open: showModal })}
            <Modal
                transitionName=''
                open={visible}
                className={className}
                title={title}
                onCancel={handleCancel}
                footer={[
                    <Button key='cancel' onClick={handleCancel}>
                        {cancelText || CancelTitle}
                    </Button>,
                    <Button
                        danger={true}
                        key='confirm'
                        loading={isWorking}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </Button>,
                ]}
            >
                {message && <div>{message}</div>}
            </Modal>
        </>
    )
}

export default ConfirmModal
