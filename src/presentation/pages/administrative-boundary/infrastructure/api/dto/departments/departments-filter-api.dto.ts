export interface DepartmentsFilterApiDto {
    search?: string;
    region_code?: string;
    municipality_code?: string;
    is_active?: boolean;
    start_date?: Date;
    end_date?: Date;
}
