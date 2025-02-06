import moment from 'moment'

export const updateArrayItemById = (arr, itemId, fields) => {
    const arrClone = [...arr]
    const item = arrClone.find(({ id }) => id === itemId)
    if (item) {
        const itemIndex = arrClone.indexOf(item)
        arrClone.splice(itemIndex, 1, { ...item, ...fields })
    }
    return arrClone
}

export const moveItemWithinArray = (arr, item, newIndex) => {
    const arrClone = [...arr]
    const oldIndex = arrClone.indexOf(item)
    arrClone.splice(newIndex, 0, arrClone.splice(oldIndex, 1)[0])
    return arrClone
}
  
export const insertItemIntoArray = (arr, item, index) => {
    const arrClone = [...arr]
    arrClone.splice(index, 0, item)
    return arrClone
}

export const copyToClipboard = value => {
    const $textarea = document.createElement('textarea')
    $textarea.value = value
    document.body.appendChild($textarea)
    $textarea.select()
    document.execCommand('copy')
    document.body.removeChild($textarea)
}
  
export const getTextContentsFromHtmlString = html => {
    const el = document.createElement('div')
    el.innerHTML = html
    return el.textContent
}
export const sortByNewest = (items, sortField) =>
    items.sort((a, b) => -a[sortField].localeCompare(b[sortField]))
  

export const formatDate = (date, format = 'MMMM D, YYYY') =>
    date ? moment(date).format(format) : date

export const formatDateTime = (date, format = 'MMMM D, YYYY, h:mm A') =>
    date ? moment(date).format(format) : date

export const formatDateTimeForAPI = date =>
    date
        ? moment(date)
            .utc()
            .format()
        : date

export const formatDateTimeConversational = date => (date ? moment(date).fromNow() : date)

export const is = {
    match: (testFn, message = '') => (value, fieldValues) => !testFn(value, fieldValues) && message,

    required: () => value => isNilOrEmptyString(value) && 'This field is required',

    minLength: min => value => !!value && value.length < min && `Must be at least ${min} characters`,

    maxLength: max => value => !!value && value.length > max && `Must be at most ${max} characters`,

    notEmptyArray: () => value =>
        Array.isArray(value) && value.length === 0 && 'Please add at least one item',

    email: () => value => !!value && !/.+@.+\..+/.test(value) && 'Must be a valid email',

    url: () => value =>
        !!value &&
    // eslint-disable-next-line no-useless-escape
    !/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(value) &&
    'Must be a valid URL',
}

const isNilOrEmptyString = value => value === undefined || value === null || value === ''

export const generateErrors = (fieldValues, fieldValidators) => {
    const errors = {}

    Object.entries(fieldValidators).forEach(([fieldName, validators]) => {
        [validators].flat().forEach(validator => {
            const errorMessage = validator(fieldValues[fieldName], fieldValues)
            if (errorMessage && !errors[fieldName]) {
                errors[fieldName] = errorMessage
            }
        })
    })
    return errors
}

export const isFocusedElementEditable = () =>
    !!document.activeElement.getAttribute('contenteditable') ||
    ['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName)
  


export function truncateDescription (description: string, postfix?, maxLength = 25): string {
    if (description.length <= maxLength) {
        return description
    }
    
    let truncated = description.slice(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    
    if (lastSpaceIndex !== -1) {
        truncated = truncated.slice(0, lastSpaceIndex)
    }
    
    return `${truncated}${postfix}`
}