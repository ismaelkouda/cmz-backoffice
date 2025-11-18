export interface User {
    readonly id: string;
    readonly matricule: string;
    readonly lastName: string;
    readonly firstName: string;
    readonly fullName: string;
    readonly email: string;
    readonly uniqId: string;
    readonly profile?: string;
    readonly status: string;
    readonly created_at?: string;
    readonly updated_at?: string;
}
