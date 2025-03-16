export const is = {
    match: (testFn, message = '') => (value, fieldValues) => !testFn(value, fieldValues) && message,
  
    required: () => value => isNilOrEmptyString(value) && 'FieldIsRequired',
  
    minLength: min => value => !!value && value.length < min && 'ValueIsTooShort',
  
    maxLength: max => value => !!value && value.length > max && 'ValueIsTooLong',
  
    email: () => value => !!value && !/.+@.+\..+/.test(value) && 'global.input.error.wrongEmails',
}
  
const isNilOrEmptyString = value => value === undefined || value === null || value === ''
  
type Validator = (value: string, allValues?: Record<string, any>) => string | undefined

export const generateErrors = (intl, fieldValues: Record<string, any>, fieldValidators: Record<string, Validator | Validator[]>) => {
    const errors: Record<string, string> = {}

    Object.entries(fieldValidators).forEach(([fieldName, validators]) => {
        [validators].flat().forEach((validator: Validator) => {
            const errorMessage = validator(fieldValues[fieldName], fieldValues)
            if (errorMessage && !errors[fieldName]) {
                errors[fieldName] = intl.formatMessage({ id: errorMessage })
            }
        })
    })

    return errors
}