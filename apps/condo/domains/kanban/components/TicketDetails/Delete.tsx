import React from 'react'

import { Trash } from '@open-condo/icons'

import { getClientSideSenderInfo } from '@condo/domains/common/utils/userid.utils'

import { useUpdateTicketMutation } from '../../../../gql'
import { Button, ConfirmModal } from '../../ui'

const ProjectBoardTicketDetailsDelete = ({ ticket, refetchTicketsBoard }) => {

    const handleTicketDelete = () => {
        deleteAction({ id: ticket.id })
    }
    const [updateTicket] = useUpdateTicketMutation({
        onCompleted: async () => {
            await refetchTicketsBoard()
        },
    })
        
    const deleteAction = async ({ id }) => {
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
            title='Are you sure you want to delete this ticket?'
            message="Once you delete, it's gone for good."
            confirmText='Delete ticket'
            onConfirm={handleTicketDelete}
            renderLink={({ open }) => (
                <Button icon={<Trash size='small'/>} iconSize={19} variant='empty' onClick={open} />
            )}
        />
    )
}

export default ProjectBoardTicketDetailsDelete
