import { css } from '@emotion/react'
import { Button, Modal, notification } from 'antd'
import { UploadFile, UploadFileStatus } from 'antd/lib/upload/interface'
import UploadList from 'antd/lib/upload/UploadList'
import { useCallback, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { Trash } from '@open-condo/icons'

import { colors, fontSizes } from '@app/condo/domains/common/constants/style'
import { TicketFile } from '@condo/domains/ticket/utils/clientSchema'

import { useDownloadFileFromServer } from '../../../../common/hooks/useDownloadFileFromServer'
import { useNotificationMessages } from '../../../../common/hooks/useNotificationMessages'
import { runMutation } from '../../../../common/utils/mutations.utils'
import { getClientSideSenderInfo } from '../../../../common/utils/userid.utils'
import { color, font } from '../../../styles'
import { UploadFile as UploadFileComponent } from '../../../ui/UploadFile'

const Files = styled.div`
  padding-top: 40px;
`

const Title = styled.div`
  ${font.size(15)};
  font-weight: 600;
`

const Text = styled.div`
  margin-top: 15px;
  ${font.size(13)};
  color: ${color.textLight}
`

const Header = styled.div`
   display: flex;
   flex-direction: row;
   gap: 10px;
   align-items: center;
`

const UploadListWrapperStyles = css`
  .ant-upload-list-text-container:first-child .ant-upload-list-item {
    margin-top: 0;
  }

  .ant-upload-list-item:hover .ant-upload-list-item-info {
    background-color: inherit;
  }
  
  & .ant-upload-span a.ant-upload-list-item-name {
    color: ${colors.black};
    text-decoration: underline;
    text-decoration-color: ${colors.lightGrey[5]};
  }
  
  .ant-upload-span .ant-upload-text-icon {
    font-size: ${fontSizes.content};
    
    & .anticon-paper-clip.anticon {
      font-size: ${fontSizes.content};
      color: ${colors.green[5]};
    }
  }`

const updateData = {
    deletedAt: new Date().toISOString(),
    dv: 1,
    sender: getClientSideSenderInfo(),
}

const ProjectBoardTicketDetailsFiles = ({ ticket, files, refetchTicketFiles }) => {
    const intl = useIntl()
    const FileLabel = intl.formatMessage({ id: 'component.uploadlist.AttachedFilesLabel' })
    const CancelLabel = intl.formatMessage({ id: 'documents.uploadDocumentsModal.cancelButton' })
    const DeleteСonfirmText = intl.formatMessage({ id: 'kanban.file.delete.confirmText' })
    const DeleteModalTitle = intl.formatMessage({ id: 'kanban.file.delete.title' })
    const DeleteMessage = intl.formatMessage({ id: 'kanban.file.delete.message' })
    const ErrorTitle = intl.formatMessage({ id: 'ErrorOccurred' })
    const NoResultFilesTitle = intl.formatMessage({ id: 'kanban.file.noResult.title' })
    const [deletedFile, setDeletedFile] = useState(null)
    const [isOpen, setOpen] = useState(false)
    const { getSuccessfulChangeNotification } = useNotificationMessages()
    const { downloadFile } = useDownloadFileFromServer()

    const uploadFiles = useMemo(() => files.map(({ file }) => ({
        uid: file.id,
        name: file.originalFilename,
        status: 'done' as UploadFileStatus,
        url: file.publicUrl,
    })), [files])

    const handleFileDownload = useCallback(async (file: UploadFile) => {
        await downloadFile({ name: file.name, url: file.url })
    }, [downloadFile])


    const handleOnRemoveFile = (deletedFile) => {
        setOpen(true)
        console.log(files, deletedFile)
        setDeletedFile(files.find((file) => file.file.id === deletedFile.uid))
    }

    const update = TicketFile.useUpdate({})
    const handleDeleteFile = () => {
        runMutation({
            action:() => update(updateData,  deletedFile),
            intl,
            OnCompletedMsg: getSuccessfulChangeNotification,
            onCompleted: () => refetchTicketFiles(),
            onError: () => notification.error({ message: ErrorTitle }),
        })
        setOpen(false)
    }

    return (
        <Files>
            <Modal
                transitionName=''
                open={isOpen}
                title={DeleteModalTitle}
                onCancel={() => setOpen(false)}
                footer={[
                    <Button key='cancel' onClick={() => setOpen(false)}>
                        {CancelLabel}
                    </Button>,
                    <Button
                        danger={true}
                        key='confirm'
                        onClick={handleDeleteFile}
                    >
                        {DeleteСonfirmText}
                    </Button>,
                ]}
            >
                <div>{DeleteMessage}</div>
            </Modal>
            <Header>
                <Title>{FileLabel}</Title>
                <UploadFileComponent refetchTicketFiles={refetchTicketFiles} ticketId={ticket.id}/>
            </Header>
            {files.length ? 
                <div style={{ width: '200px' }}>
                    <div className='upload-control-wrapper' css={UploadListWrapperStyles}>
                        <UploadList locale={{}} removeIcon={<Trash color='#CD1317' size='small'/>} showRemoveIcon={true} items={uploadFiles} onPreview={handleFileDownload} onRemove={(deletedFile) => handleOnRemoveFile(deletedFile)}/>
                    </div>
                </div>
                :
                <Text>{NoResultFilesTitle}</Text>
            }
        </Files>
    )
}

export default ProjectBoardTicketDetailsFiles