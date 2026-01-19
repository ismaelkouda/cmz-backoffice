export interface DepartmentsByRegionIdFilterApiDto {
    region_code: string;
    municipality_id?: string;
    search?: string;
    is_active?: boolean;
    start_date?: string;
    end_date?: string;
}
