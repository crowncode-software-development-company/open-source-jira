import styled from 'styled-components'

import { color, font, mixin } from '../../styles'
import { Avatar, Button } from '../../ui'


export const Filters = styled.div`
  display: flex;
  align-items: center;
   margin-bottom: 10px;
`

export const Avatars = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin: 2px 12px 0 2px;
`

const getMarginLeft = (total) => {
    if (total >= 15) return -12
    if (total >= 10) return -8
    if (total >= 5) return -4
    return -2
}


export const AvatarIsActiveBorder = styled.div<{ $isactive?: boolean, $index?: number, $total?: number }>`
  display: inline-flex;
  margin-left: -2px;
 margin-left: ${props => `${getMarginLeft(props.$total)}px`};
  border-radius: 50%;
  transition: transform 0.1s;
  ${mixin.clickable};
  ${props => props.$isactive && `box-shadow: 0 0 0 4px ${color.primary};`}
  &:hover {
    transform: translateY(-5px);
  }
`

export const StyledAvatar = styled(Avatar)`
  box-shadow: 0 0 0 2px #fff;
`

export const StyledButton = styled(Button)`
  margin-left: 6px;
`

export const ClearAll = styled.div`
  height: 32px;
  line-height: 32px;
  margin-left: 15px;
  padding-left: 12px;
  border-left: 1px solid ${color.borderLightest};
  color: ${color.textDark};
  ${font.size(14.5)}
  ${mixin.clickable}
  &:hover {
    color: ${color.textMedium};
  }
`
