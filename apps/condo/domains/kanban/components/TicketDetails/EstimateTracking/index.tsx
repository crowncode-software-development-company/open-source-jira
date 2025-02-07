
import dayjs from 'dayjs'
import { isNil } from 'lodash'
import React, { CSSProperties, Fragment, useState } from 'react'
import styled from 'styled-components'

import TrackingWidget from './TrackingWidget'

import DatePicker from '../../../../common/components/Pickers/DatePicker'
import { color, font, mixin } from '../../../styles'
import { Button, InputDebounced, Modal } from '../../../ui'


const TrackingLink = styled.div`
  padding: 4px 4px 2px 0;
  border-radius: 4px;
  transition: background 0.1s;
  ${mixin.clickable}
  &:hover {
    background: ${color.backgroundLight};
  }
`

export const ModalContents = styled.div`
  padding: 5px;
`

export const ModalTitle = styled.div`
  margin-bottom: 20px;
  ${font.size(20)}
`

export const Inputs = styled.div`
  display: flex;
  margin: 20px -5px 30px;
`

export const InputCont = styled.div`
  margin: 0 5px;
  width: 50%;
`

export const InputLabel = styled.div`
  padding-bottom: 5px;
  color: ${color.textMedium};
  ${font.size(13)};
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const SectionTitle = styled.div`
  margin: 24px 0 15px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${color.textMedium};
  ${font.size(12.5)}
`
const INPUT_STYLE: CSSProperties = { width: '18em' }
interface ProjectBoardIssueDetailsEstimateTrackingProps {
    issue: any
    updateIssue: () => void
}
const ProjectBoardIssueDetailsEstimateTracking: React.FC<ProjectBoardIssueDetailsEstimateTrackingProps> = ({ issue, updateIssue }) => {
    const [period, setPeriod] = useState('2025-18-12')
  
    const onPeriodChange = () => {
        return null
    }
    return (
        <Fragment>
            <SectionTitle>Deadline</SectionTitle>
            {renderHourInput('estimate', issue, updateIssue)}
            <InputCont>
                <DatePicker
                    style={INPUT_STYLE}
                    value={dayjs()}
                    onChange={onPeriodChange}
                    picker='month'
                    format='MMMM YYYY'
                />
            </InputCont>
            <SectionTitle>Time Tracking</SectionTitle>
            <Modal
                width={400}
                renderLink={modal => (
                    <TrackingLink onClick={modal.open}>
                        <TrackingWidget issue={issue} />
                    </TrackingLink>
                )}
                renderContent={modal => (
                    <ModalContents>
                        <ModalTitle>Time tracking</ModalTitle>
                        <TrackingWidget issue={issue} />
                        <Inputs>
                            <InputCont>
                                <InputLabel>Time spent (hours)</InputLabel>
                                {renderHourInput('timeSpent', issue, updateIssue)}
                            </InputCont>
                            <InputCont>
                                <InputLabel>Time remaining (hours)</InputLabel>
                                {renderHourInput('timeRemaining', issue, updateIssue)}
                            </InputCont>
                        </Inputs>
                        <Actions>
                            <Button variant='primary' onClick={modal.close}>Done</Button>
                        </Actions>
                    </ModalContents>
                )}
            />
        </Fragment>
    )
}
const renderHourInput = (fieldName, issue, updateIssue) => (
    <InputDebounced
        placeholder='Number'
        filter={/^\d{0,6}$/}
        value={isNil(issue[fieldName]) ? '' : issue[fieldName]}
        onChange={stringValue => {
            const value = stringValue.trim() ? Number(stringValue) : null
            updateIssue({ [fieldName]: value })
        }}
    />
)

export default ProjectBoardIssueDetailsEstimateTracking
