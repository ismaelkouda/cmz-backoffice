export interface ReportSlaItemApiDto {
    id: number;
    report_type_id: number;
    report_type: string;
    report_type_name: string;
    sla_id: number;
    sla_name: string;
    sla_description: string;
    sla_type: string;
    channel: string;
    delay: number;
    escalation_delay: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ReportSlaResponseApiDto {
    error: boolean;
    message: string;
    data: ReportSlaItemApiDto[];
}
