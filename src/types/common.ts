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

export interface Season {
    startDate: Date,
    endDate: Date,
    name: string
}


export interface Supplier {
    name?: string,
    address?: string,
    number?: any,
    account?: string,
    ifsc?: any,
}


export interface Stock {
    supplier: string,
    date: string,
    taxAmount: string,
    additionalCharges: string,
    products: any
}