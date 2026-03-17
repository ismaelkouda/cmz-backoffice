export interface MunicipalitiesCreateDto {
    code: string;
    name: string;
    region: string;
    description: string;
    department?: string;
}
