/**
 * Generated by `createservice organization.AcceptOrRejectOrganizationEmployeeRequestService --type mutations`
 */
const { get } = require('lodash')

const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')
const { getById } = require('@open-condo/keystone/schema')

const { checkPermissionsInEmployedOrRelatedOrganizations } = require('@condo/domains/organization/utils/accessSchema')
const { STAFF } = require('@condo/domains/user/constants/common')


/**
 * Requests can be accepted or rejected by:
 * 1) Employee with permission "canManageOrganizationEmployeeRequests"
 */
async function canAcceptOrRejectOrganizationEmployeeRequest ({ authentication: { item: user }, args, context }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true
    if (user.type !== STAFF) return false

    const requestId = get(args, ['data', 'employeeRequest', 'id'])
    if (!requestId) return false
    const request = await getById('OrganizationEmployeeRequest', requestId)
    if (!request || request.deletedAt) return false
    const organizationId = get(request, 'organization')
    if (!organizationId) return false

    return await checkPermissionsInEmployedOrRelatedOrganizations(context, user, organizationId, 'canManageOrganizationEmployeeRequests')
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canAcceptOrRejectOrganizationEmployeeRequest,
}
