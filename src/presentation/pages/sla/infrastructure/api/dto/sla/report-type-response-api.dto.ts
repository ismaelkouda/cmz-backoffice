export interface ReportTypeItemApiDto {
    id: number;
    sla_id: number;
    sla_type: string;
    sla_name: string;
    sla_description: string;
    sla_category: string;
    report_type_id: number;
    report_type: string;
    report_type_name: string;
    threshold: string;
    unit: string;
    channel: string;
    created_at: string;
    updated_at: string;
}

export interface ReportTypeResponseApiDto {
    error: boolean;
    message: string;
    data: ReportTypeItemApiDto[];
}
