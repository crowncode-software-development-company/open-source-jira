export const isPositionChanged = (destination, source) => {
    if (!destination) return false
    const isSameList = destination?.droppableId === source.droppableId
    const isSamePosition = destination?.index === source.index
    return !isSameList || !isSamePosition
}

export const calculateIssueListPosition = (allIssues, destination, source, droppedIssueId) => {
    const { prevIssue, nextIssue } = getAfterDropPrevNextIssue(allIssues, destination, source, droppedIssueId)
  
    if (!prevIssue && !nextIssue) return 1
    if (!prevIssue) return nextIssue.listPosition - 1
    if (!nextIssue) return prevIssue.listPosition + 1
    return prevIssue.listPosition + (nextIssue.listPosition - prevIssue.listPosition) / 2
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