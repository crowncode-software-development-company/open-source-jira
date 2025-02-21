import styled from 'styled-components'

import { color, font } from '../../styles'
import { Button } from '../../ui'

export const SelectItem = styled.div<{ $withbottommargin?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 15px;
  ${props => props.$withbottommargin && 'margin-bottom: 5px;'}
`

export const SelectItemLabel = styled.div`
  padding: 0 3px 0 6px;
`
export const LabelText = styled.span`
  font-weight: 600;
  margin-bottom: -25px;
`

export const HelpText = styled.span`
  font-weight: 500;
  ${font.size(12.5)}
`

export const Title = styled.p`
  font-weight: 600;
  margin: 0;
  ${font.size(21)}
`

export const TopActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center
`

export const Divider = styled.div`
  margin: 40px 0 0 0 ;
  border-top: 1px solid ${color.borderLightest};
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 30px;
`

export const ActionButton = styled(Button)`
  margin-left: 10px;
`