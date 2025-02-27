import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { KeyCodes } from '../../../../../constants'
import { color, font } from '../../../../../styles'
import { isFocusedElementEditable } from '../../../../../utils'

const Tip = styled.div`
  display: flex;
  align-items: center;
  padding-top: 8px;
  color: ${color.textMedium};
  ${font.size(13)}
  strong {
    padding-right: 4px;
  }
`

const TipLetter = styled.span`
  position: relative;
  top: 1px;
  display: inline-block;
  margin: 0 4px;
  padding: 0 4px;
  border-radius: 2px;
  color: ${color.textDarkest};
  background: ${color.backgroundMedium};
  ${font.size(12)}
`

interface IProps {
    setIsCommentCreating: React.Dispatch<React.SetStateAction<boolean>>
}

const ProjectBoardIssueDetailsCommentsCreateProTip: React.FC<IProps> = ({ setIsCommentCreating }) => {
    const intl = useIntl()
    const TipTitle = intl.formatMessage({ id: 'kanban.ticket.proTip.title' })
    const PressTitle = intl.formatMessage({ id: 'kanban.ticket.proTip.press.title' })
    const CreateTitle = intl.formatMessage({ id: 'kanban.ticket.proTip.create.title' })

    useEffect(() => {
        const handleKeyDown = event => {
            if (!isFocusedElementEditable() && event.keyCode === KeyCodes.M) {
                event.preventDefault()
                setIsCommentCreating(true)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [setIsCommentCreating])

    return (
        <Tip>
            <strong>{TipTitle}:</strong>{PressTitle}<TipLetter>M</TipLetter>{CreateTitle}
        </Tip>
    )
}

export default ProjectBoardIssueDetailsCommentsCreateProTip
