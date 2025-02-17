import { notification, Upload } from 'antd'
import { UploadFile as UploadFileInterface } from 'antd/lib/upload/interface'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { Paperclip } from '@open-condo/icons'

import {
    TicketFile,
} from '@condo/domains/ticket/utils/clientSchema'

import { DBFile } from '../../../common/components/ImagesUploadList'
import { MAX_UPLOAD_FILE_SIZE } from '../../../common/constants/uploads'
import { useNotificationMessages } from '../../../common/hooks/useNotificationMessages'
import { color, mixin } from '../../styles'

const StyledIcon = styled.div`
    background-color: ${color.backgroundLightest};
    width: 25px;
    height: 25px;
    border-radius: 50%;
    color: ${color.textLight};
    display: flex;
    ${mixin.clickable};
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, color 0.3s ease;
    &:hover {
        background-color: ${color.backgroundLight}; 
        color: ${color.warning}; 
    }
`

export const UploadFile = ({ ticketId, refetchTicketFiles }) => {
    const intl = useIntl()
    const { getSuccessfulChangeNotification } = useNotificationMessages()

    const FileTooBigErrorMessage = intl.formatMessage({ id: 'component.uploadlist.error.FileTooBig' },
        { maxSizeInMb: MAX_UPLOAD_FILE_SIZE / (1024 * 1024) })
    const UploadFailedErrorMessage = intl.formatMessage({ id: 'component.uploadlist.error.UploadFailedErrorMessage' })
    const createAction = TicketFile.useCreate({ ticket: { connect: { id: ticketId } } }, (file: DBFile) => Promise.resolve(file))
    
    const onSuccessFunction = async () => {
        await refetchTicketFiles()
        notification.success(getSuccessfulChangeNotification())
    }

    const options = {
        showUploadList: false,
        customRequest: (options: UploadRequestOption) => {
            const { onSuccess } = options
            const file = options.file as UploadFileInterface
            if (file.size > MAX_UPLOAD_FILE_SIZE) {
                notification.error({ message: FileTooBigErrorMessage })
                return
            }
            return createAction({ ticket: { connect: { id: ticketId } }, file } ).then(dbFile => {
                onSuccess(onSuccessFunction())
            }).catch(err => {
                notification.error({ message: UploadFailedErrorMessage })
            })
        },
    }
      
    return (
        <Upload {...options}>
            <StyledIcon>
                <Paperclip size='small'/>
            </StyledIcon>
        </Upload>
    )
}

export default UploadFile