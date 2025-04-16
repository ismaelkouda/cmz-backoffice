export interface ApiResponseBankInterface {
    error: boolean;
    message: string;
    data: Array<BankInterface>;
}

export interface BankInterface {
    id: number;
    uuid: string;
    nom: string;
    created_at: string;
    updated_at: string;
}