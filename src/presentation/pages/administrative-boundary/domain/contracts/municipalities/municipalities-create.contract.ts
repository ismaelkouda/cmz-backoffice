export interface MunicipalitiesCreateContract {
    code?: string;
    population?: number;
    infrastructure?: number;
    name?: string;
    region?: string;
    description?: string;
    department?: string | null;
}
