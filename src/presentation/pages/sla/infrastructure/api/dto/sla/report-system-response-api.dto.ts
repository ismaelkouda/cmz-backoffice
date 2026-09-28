export interface ReportSystemItemApiDto {
    id: number;
    sla_id: number;
    sla_name: string;
    description: string;
    sla_type: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ReportSystemResponseApiDto {
    error: boolean;
    message: string;
    data: ReportSystemItemApiDto[];
}
