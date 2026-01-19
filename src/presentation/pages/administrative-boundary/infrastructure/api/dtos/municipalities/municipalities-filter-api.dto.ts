export interface MunicipalitiesFilterApiDto {
    search?: string;
    region_code?: string;
    department_code?: string;
    is_active?: boolean;
    start_date?: string;
    end_date?: string;
}
