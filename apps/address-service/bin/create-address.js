/**
 * Add the address manually if there is no provider
 *
 * Usage:
 *      yarn workspace @app/address-service node bin/create-address "streetName, houseNumber"
 */


const path = require('path')

const { prepareKeystoneExpressApp } = require('@open-condo/keystone/prepareKeystoneApp')

const { AddressInjection } = require('@address-service/domains/address/utils/serverSchema')

async function main (args) {
    const [streetName, houseNumber] = args.split(',')

    if (!streetName || !houseNumber) {
        throw new Error('You must provide both street name and house number in the format: "Street Name, House Number"')
    }

    const { keystone: context } = await prepareKeystoneExpressApp(path.resolve('./index.js'), { excludeApps: ['NextApp', 'AdminUIApp'] })

    let addressData = {
        country: 'Россия',
        street: { 'name': streetName, 'typeFull': 'улица', 'typeShort': 'ул' },
        house: { 'name': houseNumber, 'typeFull': 'дом', 'typeShort': 'д' },
        dv: 1,
        sender: { 'dv': 1, 'fingerprint': 'create-address-script' },
    }
    
    const address = await AddressInjection.getOne(context, { street: addressData.street, house: addressData.house })
    
    if (!address) {
        await AddressInjection.create(context, {
            ...addressData,
        })
        console.info('Address created!')
    } else {
        throw new Error('Address already exists')
    }
}

const input = process.argv[2]

main(input).then(
    () => process.exit(),
    (error) => {
        console.error(error)
        process.exit(1)
    },
)