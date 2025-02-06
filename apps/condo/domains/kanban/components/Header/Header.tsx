import { useRouter } from 'next/router'
import styled from 'styled-components'

import { PlusCircle } from '@open-condo/icons'

import { Button } from '../../ui'

export const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
`


const ProjectBoardHeader = () => {
    const router = useRouter()
    const handleCreateModal = () => {
        router.push('?create-modal=true', undefined, { shallow: true })
    }
    return (
        <Header>
            <Button icon={<PlusCircle size='small'/>} onClick = {handleCreateModal}>Create Issue</Button>
        </Header>)
}
  
export default ProjectBoardHeader