import { notification } from 'antd'
import dynamic from 'next/dynamic'
import { RefObject, useEffect, useMemo, useRef } from 'react'
import React from 'react'
import { useIntl } from 'react-intl'
import ReactQuill, { ReactQuillProps } from 'react-quill'
import styled from 'styled-components'

import { DBFile } from '../../../common/components/ImagesUploadList'
import { MAX_UPLOAD_FILE_SIZE } from '../../../common/constants/uploads'
import { TicketFile } from '../../../ticket/utils/clientSchema'
import { color } from '../../styles'
import Spinner from '../Spinner'

const ReactQuillComponent = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill')

        const Component = ({ forwardedRef, ...props }: { forwardedRef: RefObject<ReactQuill> } & ReactQuillProps) => (
            <RQ ref={forwardedRef} {...props} />
        )

        Component.displayName = 'ReactQuillComponent'
        return Component
    },
    {
        ssr: false,
        loading: () => <Spinner color='gray' size={25}/>,
    }
)

// const MAX_IMAGE_WIDTH = 500 
// const MAX_IMAGE_HEIGHT = 300

const EditorCont = styled.div`
  .ql-toolbar.ql-snow {
    border-radius: 4px 4px 0 0;
    border: 1px solid ${color.borderLightest};
    border-bottom: none;
  }
  .ql-container.ql-snow {
    border-radius: 0 0 4px 4px;
    border: 1px solid ${color.borderLightest};
    border-top: none;
    color: ${color.textDarkest};
  }
  .ql-editor {
    min-height: 110px;
  }
`

const TextEditor = ({ value, onChange, ticketId }) => {
    const quillRef = useRef<ReactQuill>(null)
    const intl = useIntl()
    const PlaceholderTitle = intl.formatMessage({ id: 'kanban.ticket.description.placeholder' })
    // const FileTooBigErrorMessage = intl.formatMessage({ id: 'component.uploadlist.error.FileTooBig' },
    //     { maxSizeInMb: MAX_UPLOAD_FILE_SIZE / (1024 * 1024) })
    // const UploadFailedErrorMessage = intl.formatMessage({ id: 'component.uploadlist.error.UploadFailedErrorMessage' })

    // useEffect(() => {
    //     if (quillRef.current) {
    //         const quillEditor = quillRef.current.getEditor()
    //         quillEditor.root.addEventListener('paste', handlePaste)

    //         return () => {
    //             quillEditor.root.removeEventListener('paste', handlePaste)
    //         }
    //     }
    // }, [])

    // const handlePaste = (e) => {
    //     const clipboardData = e.clipboardData
    //     if (clipboardData) {
    //         const items = clipboardData.items
    //         for (let i = 0; i < items.length; i++) {
    //             const item = items[i]
    //             if (item.kind === 'file' && item.type.startsWith('image/')) {
    //                 e.preventDefault()
    //                 notification.error({ message: 'Вставка изображений через буфер обмена запрещена.' })
    //                 return
    //             }
    //         }
    //     }
    // }

    // const createAction = TicketFile.useCreate({ ticket: { connect: { id: ticketId } } }, (file: DBFile) => Promise.resolve(file))

    // function imgHandler () {
    //     const quill = quillRef.current.getEditor()
    //     let fileInput = quill.root.querySelector('input.ql-image[type=file]') as HTMLInputElement | null
      
    //     if (fileInput === null) {
    //         fileInput = document.createElement('input')
    //         fileInput.setAttribute('type', 'file')
    //         fileInput.setAttribute(
    //             'accept',
    //             'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
    //         )
    //         fileInput.classList.add('ql-image')
      
    //         fileInput.addEventListener('change', () => {
    //             const files = fileInput.files
    //             const range = quill.getSelection(true)
      
    //             if (!files || !files.length) {
    //                 return
    //             }
    //             const file = files[0]
    //             if (file.size > MAX_UPLOAD_FILE_SIZE) {
    //                 notification.error({ message: FileTooBigErrorMessage })
    //                 return
    //             }
    //             createAction({ ticket: { connect: { id: ticketId } }, file }).then(dbFile => {
    //                 const img = new Image()
    //                 img.src = URL.createObjectURL(file)
    //                 img.onload = () => {
    //                     const { width, height } = img
    //                     const finalWidth = width > MAX_IMAGE_WIDTH ? MAX_IMAGE_WIDTH : width
    //                     const finalHeight = height > MAX_IMAGE_HEIGHT ? MAX_IMAGE_HEIGHT : height
    //                     quill.insertEmbed(range.index, 'image', dbFile.file.publicUrl, 'user')
    //                     quill.formatText(range.index, 1, { width: finalWidth, height: finalHeight })
    //                     quill.setSelection({ index: range.index + 1, length: 0 })
    //                 }
    //                 quill.enable(true)
    //                 fileInput.value = ''
    //             }).catch(err => {
    //                 console.error(err)
    //                 notification.error({ message: UploadFailedErrorMessage })
    //                 quill.enable(true)
    //             })
    //         })
    //         quill.root.appendChild(fileInput)
    //     }
    //     fileInput.click()
    // }

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ color: [] }, { background: [] }],
                    // ['image', 'link'],
                    ['link'],
                    ['clean'],
                ],
                // handlers: { image: imgHandler },
            },
        }),
        []
    )
        
    return (
        <EditorCont>
            <ReactQuillComponent
                forwardedRef={quillRef}
                theme='snow'
                value={value}
                onChange={onChange}
                placeholder={PlaceholderTitle}
                modules={modules}
            />
        </EditorCont>
    )
}

export default TextEditor
