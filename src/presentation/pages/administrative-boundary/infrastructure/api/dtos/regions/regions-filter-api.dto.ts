export interface RegionsFilterApiDto {
    search?: string;
    department_code?: string;
    municipality_code?: string;
    is_active?: boolean;
    start_date?: string;
    end_date?: string;
}
