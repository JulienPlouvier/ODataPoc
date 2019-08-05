import moment from "moment"
import { Filter } from "../app/models/Filters";

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

export function buildOdataQueryFilter(filters: Filter[]): string {
    var filterQuery = '\?\$filter\='
    var queries = filters.map(x => createQuery(x.Field, x.FieldType, x.Comparator, x.Operator, x.AdressField))
        .join(' and ')
    return filterQuery + queries
}

function createQuery(field: string, type: fieldType, comparator: string, operator: operators, addressField?: string) {
    var query = ''
    if (addressField) {
        query += 'Addresses\/any(x\:'
        field = 'x\/' + (addressField as string)
    }

    switch (type) {
        case fieldType.string:
            query += buildStringQuery(field, comparator, operator)
            break;
        case fieldType.date:
            query += buildDateQuery(field, comparator, operator)
            break;
        case fieldType.family:
            query += buildFamilyQuery(field, comparator, operator)
            break;
    }

    if (addressField)
        query += ')'

    return query

}