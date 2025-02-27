import { padStart } from 'lodash'
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
    const modifiedHtml = html.replace(/<(w+)/g, '<$1 ')
    const el = document.createElement('div')
    el.innerHTML = modifiedHtml
    return el.textContent.trim()
}

export const sortByNewest = (items, sortField) =>
    items.sort((a, b) => -a[sortField].localeCompare(b[sortField]))

export const formatDateTimeConversational = date => (date ? moment(date).fromNow() : date)

export const formatDefferedDate = (beforeTitle, date) => {
    return `${beforeTitle} ${moment(date).format('DD.MM')}`
}


export const isFocusedElementEditable = () =>
    !!document.activeElement.getAttribute('contenteditable') ||
    ['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName)

export function isEmptyHtml (html) {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return !tempDiv.innerText.trim() && !tempDiv.querySelector('img')
}