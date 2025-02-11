import React, { Fragment, useState } from 'react'
import styled from 'styled-components'

import { KeyCodes } from '../../../constants'
import { color, font } from '../../../styles'
import { Textarea } from '../../../ui'

const TitleTextarea = styled(Textarea)`
  margin: 18px 0 0 -12px;
  height: 44px;
  width: 100%;
  textarea {
    padding: 7px 7px 8px;
    line-height: 1.28;
    border: none;
    resize: none;
    background: #fff;
    box-shadow: 0 0 0 1px transparent;
    transition: background 0.1s;
    ${font.size(24)}
    &:hover:not(:focus) {
      background: ${color.backgroundLight};
    }
  }
`
const ErrorText = styled.div`
  padding-top: 4px;
  color: ${color.danger};
  ${font.size(13)}
`

const ProjectBoardIssueDetailsTitle = ({ ticket, updateTicket }) => {
    const [error, setError] = useState(null)

    const handleTitleChange = () => {
        setError(null)
    }

    return (
        <Fragment>
            <TitleTextarea
                onChange={() => null}
                minRows={1}
                disabled
                placeholder='Short summary'
                defaultValue={`Заявка №${ticket.number} / ${ticket.classifier.category.name} 🠖 ${ticket.classifier.place.name}`}
                onBlur={handleTitleChange}
                onKeyDown={event => {
                    if (event.keyCode === KeyCodes.ENTER) {
                        (event.target as HTMLTextAreaElement).blur() 
                    }
                }}
            />
            {error && <ErrorText>{error}</ErrorText>}
        </Fragment>
    )
}

export default ProjectBoardIssueDetailsTitle
