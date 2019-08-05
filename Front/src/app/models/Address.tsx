export type Adress = {
    Number: number
    PostalCode: string
    City: string
    Street: string
    StreetType: TypesStreet
    Country: string
}

export enum TypesStreet {
    Street,
    Road,
    Avenue,
    Boulevard,
    DeadEnd,
}

export function AdressToString(adress: Adress): string {
    let type = adress.StreetType === TypesStreet.Street
        ? 'Rue'
        : adress.StreetType === TypesStreet.Road
            ? 'Route'
            : adress.StreetType === TypesStreet.Avenue
                ? 'Avenue'
                : adress.StreetType === TypesStreet.Boulevard
                    ? 'Boulevard'
                    : 'Cul de Sac';
    return adress.Number + ' '
        + type + ' '
        + adress.Street + ', '
        + adress.City + ' ( ' + adress.PostalCode + ' ), '
        + adress.Country
}