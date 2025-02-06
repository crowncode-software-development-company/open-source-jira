import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
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

const propTypes = {
    setFormOpen: PropTypes.func.isRequired,
}

interface IProps {
    setFormOpen: (update) => void
}

const ProjectBoardIssueDetailsCommentsCreateProTip: React.FC<IProps> = ({ setFormOpen }) => {
    useEffect(() => {
        const handleKeyDown = event => {
            if (!isFocusedElementEditable() && event.keyCode === KeyCodes.M) {
                event.preventDefault()
                setFormOpen(true)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [setFormOpen])

    return (
        <Tip>
            <strong>Pro tip:</strong>press<TipLetter>M</TipLetter>to comment
        </Tip>
    )
}

ProjectBoardIssueDetailsCommentsCreateProTip.propTypes = propTypes

export default ProjectBoardIssueDetailsCommentsCreateProTip
