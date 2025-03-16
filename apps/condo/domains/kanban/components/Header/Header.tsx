import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { PlusCircle, Search } from '@open-condo/icons'

import { Button } from '../../ui'

export const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  gap: 10px;
`


const ProjectBoardHeader = () => {
    const intl = useIntl()
    const CreateTicketTitle = intl.formatMessage({ id: 'CreateTicket' })
    const SearchTicketTitle = intl.formatMessage({ id: 'kanban.SearchTicket' })
    const router = useRouter()
    
    const handleCreateModal = () => {
        router.push('?create-modal=true', undefined, { shallow: true })
    }

    const handleSearchModal = () => {
        router.push('?search-modal=true', undefined, { shallow: true })
    }

    return (
        <Header>
            <Button icon={<PlusCircle size='small'/>} onClick = {handleCreateModal}>{CreateTicketTitle}</Button>
            <Button icon={<Search size='small'/>} onClick = {handleSearchModal}>{SearchTicketTitle}</Button>
        </Header>
    )
}
  
export default ProjectBoardHeader