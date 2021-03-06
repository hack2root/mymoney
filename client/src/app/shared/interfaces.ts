export interface User {
    email: string;
    password: string;
}

export interface RegUser {
    fname: string;
    lname: string;
    gender: boolean;
    email: string;
    password: string;
}

export interface Organization {
    name: string;
    image?: string;
    user?: string;
    id?: string;
}

export interface Income {
    date: string
    value: string
    cach: boolean
    comments: string
    currency_id: number
    user?: string
    organization_id: number
    oname?: string
    id?: string
}

export interface OrganizationSumm {
    id: number
    name: string
    summa: number
}

export interface OrganizationMonthSumm {
    id: number
    name: string
    month: string
    rub: number
    usd: number
    eur: number
}

export interface Filter {
    organization_id?: number
    sdate?: Date
    edate?: Date
}