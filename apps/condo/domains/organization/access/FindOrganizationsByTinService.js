/**
 * Generated by `createservice organization.FindOrganizationsByTinService --type queries`
 */
const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')

const { STAFF } = require('@condo/domains/user/constants/common')


async function canFindOrganizationsByTin ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    return user.type === STAFF
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canFindOrganizationsByTin,
}
