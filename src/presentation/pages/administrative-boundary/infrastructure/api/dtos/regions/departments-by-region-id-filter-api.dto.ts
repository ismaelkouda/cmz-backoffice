export interface DepartmentsByRegionIdFilterApiDto {
    region_code: string;
    municipality_code?: string;
    search?: string;
    is_active?: boolean;
    start_date?: string;
    end_date?: string;
}
