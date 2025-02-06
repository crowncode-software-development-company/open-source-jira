export const IssueType = {
    TASK: 'task',
    BUG: 'bug',
    STORY: 'story',
}

export const IssueStatus = {
    'Открыта': 'Открыта',
    'Отменена': 'Отменена',
    'В работе': 'В работе',
    'Закрыта': 'Закрыта',
    'Выполнена': 'Выполнена',
    'Отложена':'Отложена',
}

export const IssuePriority = {
    HIGHEST: '5',
    HIGH: '4',
    MEDIUM: '3',
    LOW: '2',
    LOWEST: '1',
}

export const IssueTypeCopy = {
    [IssueType.TASK]: 'Task',
    [IssueType.BUG]: 'Bug',
    [IssueType.STORY]: 'Story',
}

export const IssueStatusCopy = {
    [IssueStatus.Открыта]: 'Открыта',
    [IssueStatus.Отменена]: 'Отменена',
    [IssueStatus['В работе']]: 'В работе',
    [IssueStatus.Закрыта]: 'Закрыта',
    [IssueStatus.Выполнена]: 'Выполнена',
    [IssueStatus.Отложена]: 'Отложена',
}

export const IssuePriorityCopy = {
    [IssuePriority.HIGHEST]: 'Highest',
    [IssuePriority.HIGH]: 'High',
    [IssuePriority.MEDIUM]: 'Medium',
    [IssuePriority.LOW]: 'Low',
    [IssuePriority.LOWEST]: 'Lowest',
}

export const KeyCodes = {
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    M: 77,
}
  
export const ProjectCategory = {
    SOFTWARE: 'software',
    MARKETING: 'marketing',
    BUSINESS: 'business',
}
  
export const ProjectCategoryCopy = {
    [ProjectCategory.SOFTWARE]: 'Software',
    [ProjectCategory.MARKETING]: 'Marketing',
    [ProjectCategory.BUSINESS]: 'Business',
}
  