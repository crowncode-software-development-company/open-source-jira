import { getSortedListTickets } from '../List/utils'

export const isPositionChanged = (destination, source) => {
    if (!destination) return false
    const isSameList = destination?.droppableId === source.droppableId
    const isSamePosition = destination?.index === source.index
    return !isSameList || !isSamePosition
}

export const calculateTicketColumnPosition = (allTickets, destination, source, droppedIssueId) => {
    const { prevTicket, nextTicket } = getAfterDropPrevNextTicket(allTickets, destination, source, droppedIssueId)
    if (!prevTicket && !nextTicket) return 1
    const nextTicketColumnPosition = nextTicket?.meta?.columnPosition ?? 5 
    const prevTicketColumnPosition = prevTicket?.meta?.columnPosition ?? 4 
    if (!prevTicket) return nextTicketColumnPosition - 1
    if (!nextTicket) return prevTicketColumnPosition + 1
    return prevTicketColumnPosition + (nextTicketColumnPosition - prevTicketColumnPosition) / 2
}

export const getAfterDropPrevNextTicket = (allTickets, destination, source, droppedIssueId) => {
    const beforeDropDestinationTickets = getSortedListTickets(allTickets, destination.droppableId)
    const droppedIssue = allTickets.find(ticket => ticket.id === droppedIssueId)
    
    const isSameList = destination.droppableId === source.droppableId
   
    const afterDropDestinationTickets = isSameList
        ? moveItemWithinArray(beforeDropDestinationTickets, droppedIssue, destination.index)
        : insertItemIntoArray(beforeDropDestinationTickets, droppedIssue, destination.index)
  
    return {
        prevTicket: afterDropDestinationTickets[destination.index - 1],
        nextTicket: afterDropDestinationTickets[destination.index + 1],
    }
}

const moveItemWithinArray = (arr, item, newIndex) => {
    const arrClone = [...arr]
    const oldIndex = arrClone.indexOf(item)
    arrClone.splice(oldIndex, 1)
    return insertItemIntoArray(arrClone, item, newIndex)
}
  
const insertItemIntoArray = (arr, item, index) => {
    const arrClone = [...arr]
    arrClone.splice(index, 0, item)
    return arrClone
}