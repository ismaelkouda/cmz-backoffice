export interface MunicipalitiesUpdateDto {
    uniqId: string;
    code: string;
    name: string;
    region: string;
    description: string;
    department?: string;
}
