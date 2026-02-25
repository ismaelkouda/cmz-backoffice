export interface MunicipalitiesByDepartmentIdFilterApiDto {
    id: string;
    region_code: string;
    department_code: string;
    search?: string;
    is_active?: boolean;
    start_date?: Date;
    end_date?: Date;
}
