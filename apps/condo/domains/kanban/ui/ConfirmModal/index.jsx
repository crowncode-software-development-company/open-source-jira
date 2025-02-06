import { Modal, Button } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

const propTypes = {
    className: PropTypes.string,
    variant: PropTypes.oneOf(['primary', 'danger']),
    title: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    renderLink: PropTypes.func.isRequired,
}

const defaultProps = {
    className: undefined,
    variant: 'primary',
    title: 'Warning',
    message: 'Are you sure you want to continue with this action?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
}

const ConfirmModal = ({
    className,
    variant,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    renderLink,
}) => {
    const [isWorking, setWorking] = useState(false)
    const [visible, setVisible] = useState(false)

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
                        {cancelText}
                    </Button>,
                    <Button
                        key='confirm'
                        type={variant === 'danger' ? 'danger' : 'primary'}
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

ConfirmModal.propTypes = propTypes
ConfirmModal.defaultProps = defaultProps

export default ConfirmModal
