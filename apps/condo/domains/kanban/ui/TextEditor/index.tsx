import dynamic from 'next/dynamic'
import { useState } from 'react'
import styled from 'styled-components'

import { color } from '../../styles'
import Spinner from '../Spinner'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false,
    loading: () => <Spinner color='gray' size={25}/>,
})

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


const TextEditor = ({ value, onChange, placeholder }) => {
    const [editorHtml, setEditorHtml] = useState(value || '')

    const handleChange = (html) => {
        setEditorHtml(html)
        onChange(html)
        console.log(html)
    }

    return (
        <EditorCont>
            <ReactQuill
                theme='snow'
                value={editorHtml}
                onChange={handleChange}
                placeholder={placeholder}
                modules={TextEditor.modules}
            />
        </EditorCont>
    )
}

TextEditor.modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        ['clean'],
    ],
}

export default TextEditor
