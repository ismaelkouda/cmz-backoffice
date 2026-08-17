export interface DepartmentsCreateValidateContract {
    code: string;
    population: number;
    infrastructure: number;
    name: string;
    region: string;
    description?: string;
}
