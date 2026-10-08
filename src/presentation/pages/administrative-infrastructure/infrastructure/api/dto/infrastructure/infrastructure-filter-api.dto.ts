export interface InfrastructureFilterApiDto {
    search?: string;
    infrastructure_type?: string;
    region_id: string;
    department_id: string;
    municipality_id: string;
    start_date?: string;
    end_date?: string;
}
