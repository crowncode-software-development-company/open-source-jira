import styled from 'styled-components'

import { color, font, mixin } from '../../styles'
import { Avatar, InputDebounced, Spinner } from '../../ui'


export const TicketSearch = styled.div`
  padding: 25px 35px 60px;
`

export const SearchInputCont = styled.div`
  position: relative;
  margin-bottom: 40px;
  border: none;
`

export const SearchInputDebounced = styled(InputDebounced)`
  height: 40px;
  input {
    border: none;
    border-bottom: 2px solid ${color.primary};
    background: #fff;
    ${font.size(21)}
    &:focus,
    &:hover {
      box-shadow: none;
      border: none;
      border-bottom: 2px solid ${color.primary};
      background: #fff;
    }
    &:focus {
      outline: none;
    }
  }
`
export const SearchSpinner = styled(Spinner)`
  position: absolute;
  top: 5px;
  right: 30px;
`

export const Ticket = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid ${color.backgroundLight};
  transition: background 0.1s;
  ${mixin.clickable}
  &:hover {
    background: ${color.backgroundLight};
  }
`
export const Avatars = styled.div`
  display: flex;
  flex-direction: row-reverse;
`

export const StyledAvatar = styled(Avatar)`
  box-shadow: 0 0 0 1px #fff;
  margin-left: -15px;
`

export const TicketDataContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
export const TicketData = styled.div`
  padding-left: 15px;
`

export const TicketTitleText = styled.div`
  color: ${color.textDark};
  ${font.size(15)}
`
export const TicketTypeColor = styled.span<{ $color?: string }>`
 ${props => props.$color && `color: ${props.$color};`}
`
export const TicketTypeId = styled.div`
  color: ${color.textMedium};
  ${font.size(12.5)}
`

export const SectionTitle = styled.div`
  padding-bottom: 12px;
  text-transform: uppercase;
  color: ${color.textMedium};
  ${font.size(14)}
`

export const NoResults = styled.div`
  text-align: center;
`

export const NoResultsTitle = styled.div`
  ${font.size(20)}
   color: ${color.textMedium};
`

export const NoResultsTip = styled.div`
  ${font.size(15)}
   color: ${color.textMedium};
`


export const TicketLink = styled.div`
  display: block;
  margin-bottom: 5px;
`

export const NumberTicket = styled.span`
font-weight: 600;
`