import { Adress as Address } from "./Address";

export type Person = {
    Addresses: Address[]
    Surname: string
    Name: string
    Birth: Date
    Family: FamilyName
}

export enum FamilyName { Paul, Charles, Henry }

export function FamilyNameToString(family: FamilyName): string {
    return family === FamilyName.Charles
        ? 'Charles'
        : family === FamilyName.Henry
            ? 'Henry'
            : 'Paul'
}
