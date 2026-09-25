export interface ReportSlaItemApiDto {
    id: number;
    report_type_id: number;
    sla_id: number;
    channel: string;
    delay: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    sla: { id: number; name: string; description?: string; order?: number };
}

export interface ReportSlaResponseApiDto {
    error: boolean;
    message: string;
    data: ReportSlaItemApiDto[];
}
