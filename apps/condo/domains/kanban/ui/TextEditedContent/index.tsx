import 'quill/dist/quill.snow.css'
import styled from 'styled-components'

import { font } from '../../styles'

export const Content = styled.div`
  padding: 0 !important;
  ${font.size(15)}
`

interface TextEditedContentProps {
    content: string
    [key: string]: any
}

const TextEditedContent: React.FC<TextEditedContentProps> = ({ content, ...otherProps }) => (
    <div className='ql-snow'>
        <Content className='ql-editor' dangerouslySetInnerHTML={{ __html: content }} {...otherProps} />
    </div>
)

export default TextEditedContent
