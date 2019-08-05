import moment from "moment"

export type OdataWrapper<T> = {
    ['@odata.context']: string
    value: T
}

export enum operators {
    startsWith,
    endsWith,
    contains,
    before,
    after,
    in,
    notIn
}

export enum fieldType {
    string,
    family,
    date
}

export enum fields {
    Name = "Name",
    Address = "Addresses",
    Birth = "Birth",
    Family = "Family"
}

export enum addressFields {
    City = "City",
    PostalCode = "PostalCode",
    Street = "Street",
}

function buildStringQuery(field: string, comparator: string, operator: operators) {
    var stringQuery = ''
    switch (operator) {
        case operators.startsWith:
            stringQuery = 'startswith('
            break
        case operators.endsWith:
            stringQuery = 'endsWith('
            break
        case operators.contains:
            stringQuery = 'contains('
            break
        default:
            throw new Error('Operator and fieldType not matching')
    }
    return stringQuery + field + ', \'' + comparator + '\')'
}

function buildDateQuery(field: string, comparator: string, operator: operators) {
    console.log(operator)
    var stringQuery = field
    var date = moment(comparator).format('YYYY-MM-DDTHH:mm:ss')
    switch (operator) {
        case operators.before:
            stringQuery += ' lt '
            break
        case operators.after:
            stringQuery += ' gt '
            break
        default:
            throw new Error('Operator and fieldType not matching')
    }
    return stringQuery + date + 'Z'
}

function buildFamilyQuery(field: string, comparator: string, operator: operators) {
    var stringQuery = field
    switch (operator) {
        case operators.in:
            stringQuery += ' eq '
            break
        case operators.notIn:
            stringQuery += ' ne '
            break
        default:
            throw new Error('Operator and fieldType not matching')
    }
    return stringQuery + comparator
}

export function buildOdataQueryFilter(field: string, type: fieldType, comparator: string, operator: operators, addressField?: addressFields): string {

    var filterQuery = '\?\$filter\='

    if (addressField) {
        filterQuery += 'Addresses\/any(x\:'
        field = 'x\/' + (addressField as string)
    }

    switch (type) {
        case fieldType.string:
            filterQuery += buildStringQuery(field, comparator, operator)
            break;
        case fieldType.date:
            filterQuery += buildDateQuery(field, comparator, operator)
            break;
        case fieldType.family:
            filterQuery += buildFamilyQuery(field, comparator, operator)
            break;
    }

    if (addressField)
        filterQuery += ')'

    return filterQuery

}