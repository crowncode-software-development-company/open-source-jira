import { Modal as AntModal } from 'antd'
import React, { useState } from 'react'

interface ModalProps {
    width?: number
    renderLink: (props: { open: () => void }) => React.ReactNode
    renderContent: (props: { close: () => void }) => React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
    width,
    renderLink,
    renderContent,
}) => {
    const [visible, setVisible] = useState(false)

    const showModal = () => {
        setVisible(true)
    }

    const handleCancel = () => {
        setVisible(false)
    }

    return (
        <>
            {renderLink({ open: showModal })}
            <AntModal
                transitionName=''
                open={visible}
                onCancel={handleCancel}
                footer={null}
                width={width}
            >
                {renderContent({ close: handleCancel })}
            </AntModal>
        </>
    )
}

export default Modal
