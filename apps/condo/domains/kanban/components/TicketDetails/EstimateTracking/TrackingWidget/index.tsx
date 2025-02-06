import React from 'react'
import styled from 'styled-components'

import { Clock } from '@open-condo/icons'

import { calculateTrackingBarWidth, renderRemainingOrEstimate } from './utils'

import { color, font } from '../../../../styles'


const TrackingWidget = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ClockContainer = styled.div`
  maegin-top: -4px;
`

const Right = styled.div`
  width: 90%;
`

const BarCont = styled.div`
  height: 5px;
  border-radius: 4px;
  background: ${color.backgroundMedium};
`

const Bar = styled.div<{ width: number }>`
  height: 5px;
  border-radius: 4px;
  background: ${color.primary};
  transition: all 0.1s;
  width: ${props => props.width}%;
`

const Values = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 3px;
  ${font.size(14.5)};
`

interface IProps {
    issue: any
}

const ProjectBoardIssueDetailsTrackingWidget: React.FC<IProps> = ({ issue }) => (
    <TrackingWidget>
        <ClockContainer>
            <Clock size='large' color={color.textMedium}/>
        </ClockContainer>
        <Right>
            <BarCont>
                <Bar width={calculateTrackingBarWidth(issue)} />
            </BarCont>
            <Values>
                <div>{issue.timeSpent ? `${issue.timeSpent}h logged` : 'No time logged'}</div>
                {renderRemainingOrEstimate(issue)}
            </Values>
        </Right>
    </TrackingWidget>
)

export default ProjectBoardIssueDetailsTrackingWidget
