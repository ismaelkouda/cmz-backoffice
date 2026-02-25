export interface RegionsFilterApiDto {
    search?: string;
    department_code?: string;
    municipality_code?: string;
    is_active?: boolean;
    start_date?: Date;
    end_date?: Date;
}
