import moment from 'moment'

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

export const formatDateTimeConversational = date => (date ? moment(date).fromNow() : date)

export const isFocusedElementEditable = () =>
    !!document.activeElement.getAttribute('contenteditable') ||
    ['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName)

export function isEmptyHtml (html) {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return !tempDiv.innerText.trim() && !tempDiv.querySelector('img')
}