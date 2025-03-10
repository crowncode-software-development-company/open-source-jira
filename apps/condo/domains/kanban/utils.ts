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

export const formatDateTimeConversational = date => {
    if (!date) return date
    const modifiedDate = moment(date).add(10, 'seconds')
    return modifiedDate.fromNow()
}

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

export function truncateDescription (details: string, maxLength = 35): string {
    if (details.length <= maxLength) {
        return details
    }
    let truncated = details.slice(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    if (lastSpaceIndex !== -1) {
        truncated = truncated.slice(0, lastSpaceIndex)
    }

    return `${truncated}...`
}

export function ticketHasDeferUntil (ticket): boolean {
    if (ticket.deferredUntil && ticket.status.id === 'c14a58e0-6b5d-4ec2-b91c-980a90509c7f') {
        return true
    } else {
        return false
    }
}