import { notification } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'

import { Trash } from '@open-condo/icons'

import { getClientSideSenderInfo } from '@condo/domains/common/utils/userid.utils'

import { useUpdateTicketMutation } from '../../../../gql'
import { Button, ConfirmModal } from '../../ui'

const ProjectBoardTicketDetailsDelete = ({ ticket, refetchTicketsBoard, handleCloseModals }) => {
    const intl = useIntl()
    const DeleteСonfirmText = intl.formatMessage({ id: 'kanban.ticket.delete.confirmText' })
    const DeleteTitle = intl.formatMessage({ id: 'kanban.ticket.delete.title' })
    const DeleteMessage = intl.formatMessage({ id: 'kanban.ticket.delete.message' })
    const DeleteSuccessNotificationMessage = intl.formatMessage({ id: 'kanban.ticket.successDelete.title' })

    const [updateTicket] = useUpdateTicketMutation({
        onCompleted: async () => {
            await refetchTicketsBoard()
            notification.success({ message: DeleteSuccessNotificationMessage })
            handleCloseModals()
        },
    })

    const handleTicketDelete = () => {
        deleteAction(ticket.id)
    }
        
    const deleteAction = async ( id ) => {
        await updateTicket({
            variables: {
                id,
                data: {
                    deletedAt: new Date().toISOString(),
                    dv: 1,
                    sender: getClientSideSenderInfo(),
                },
            },
        })
    }

    return (
        <ConfirmModal
            title={DeleteTitle}
            message={DeleteMessage}
            confirmText={DeleteСonfirmText}
            onConfirm={handleTicketDelete}
            renderLink={({ open }) => (
                <Button icon={<Trash size='small'/>} iconSize={19} variant='empty' onClick={open} />
            )}
        />
    )
}

export default ProjectBoardTicketDetailsDelete
