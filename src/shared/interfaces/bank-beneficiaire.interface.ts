export interface ApiResponseBankBenefitInterface {
    error: boolean;
    message: string;
    data: Array<BankBenefitInterface>;
}

export interface BankBenefitInterface {
    code: string;
    nom: string;
    rib: string;
    agences: Array<AgencyBenefitInterface>;
}

export interface AgencyBenefitInterface {
    code: string;
    nom: string;
}