import { operators, fieldType } from "../../infrastructure/odataQueryBuilder";

export type Filter = {
    OperatorsForField: Operator[]
    ComparatorsForField: Comparator[]
    Field: string
    AdressField: string
    Operator: operators
    Comparator: string
    FieldType: fieldType
}

export type Operator = {
    key: operators,
    value: string
}

export type Comparator = {
    key: any,
    value: string
}