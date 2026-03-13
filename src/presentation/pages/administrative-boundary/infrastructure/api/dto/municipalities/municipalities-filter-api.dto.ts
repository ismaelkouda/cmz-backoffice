export interface MunicipalitiesFilterApiDto {
    search?: string;
    region_id?: string;
    department_id?: string;
    is_active?: boolean;
    start_date?: Date;
    end_date?: Date;
}
