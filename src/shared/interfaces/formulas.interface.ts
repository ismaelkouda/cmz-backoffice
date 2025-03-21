export interface ApiResponseFormulasInterface {
    error: boolean;
    message: string;
    data: Array<FormulasInterface>;
}

export interface FormulasInterface {
    id: number;
    uuid: string;
    nom: string;
    created_at: string;
    updated_at: string;
}