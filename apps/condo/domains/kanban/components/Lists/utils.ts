import { insertItemIntoArray, moveItemWithinArray } from '../../utils'

export const isPositionChanged = (destination, source) => {
    if (!destination) return false
    const isSameList = destination?.droppableId === source.droppableId
    const isSamePosition = destination?.index === source.index
    return !isSameList || !isSamePosition
}

export const calculateIssueListPosition = (allIssues, destination, source, droppedIssueId) => {
    const { prevIssue, nextIssue } = getAfterDropPrevNextIssue(allIssues, destination, source, droppedIssueId)
    let position
  
    if (!prevIssue && !nextIssue) {
        position = 1
    } else if (!prevIssue) {
        position = nextIssue.listPosition - 1
    } else if (!nextIssue) {
        position = prevIssue.listPosition + 1
    } else {
        position = prevIssue.listPosition + (nextIssue.listPosition - prevIssue.listPosition) / 2
    }
    return position
}

export const getAfterDropPrevNextIssue = (allIssues, destination, source, droppedIssueId) => {
    const beforeDropDestinationIssues = getSortedListIssues(allIssues, destination.droppableId)
    const droppedIssue = allIssues.find(issue => issue.id === droppedIssueId)
    const isSameList = destination.droppableId === source.droppableId
   
    const afterDropDestinationIssues = isSameList
        ? moveItemWithinArray(beforeDropDestinationIssues, droppedIssue, destination.index)
        : insertItemIntoArray(beforeDropDestinationIssues, droppedIssue, destination.index)
  
    return {
        prevIssue: afterDropDestinationIssues[destination.index - 1],
        nextIssue: afterDropDestinationIssues[destination.index + 1],
    }
}


export const getSortedListIssues = (issues, status) =>
    issues.filter(issue => issue.status === status).sort((a, b) => a.listPosition - b.listPosition)
