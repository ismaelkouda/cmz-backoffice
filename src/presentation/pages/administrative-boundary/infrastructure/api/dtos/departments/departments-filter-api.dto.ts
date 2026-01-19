export interface DepartmentsFilterApiDto {
    search?: string;
    region_code?: string;
    municipality_id?: string;
    is_active?: boolean;
    start_date?: string;
    end_date?: string;
}
