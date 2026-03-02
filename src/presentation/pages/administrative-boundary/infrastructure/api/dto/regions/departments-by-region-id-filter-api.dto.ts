export interface DepartmentsByRegionIdFilterApiDto {
    id: string;
    region_code: string;
    municipality_code?: string;
    search?: string;
    is_active?: boolean;
    start_date?: Date;
    end_date?: Date;
}
