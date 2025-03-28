export interface Customer {
    firstName: string,
    lastName: string,
    address: string,
    number: string,
    alternateNumber: string,
    fatherName: string,
    status: string,
}

export interface Order {
    customer: string,
    date: string,
    items: any
}

export interface Transaction {
    customer: string,
    date: string,
    paymentType: string,
    amount: number
}