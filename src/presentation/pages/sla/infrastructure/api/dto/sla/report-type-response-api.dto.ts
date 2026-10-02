export interface ReportTypeItemApiDto {
    id: string | number;
    sla_id: string | number;
    sla_type: string;
    sla_name: string;
    sla_description: string;
    sla_category: string;
    report_type_id?: string | number;
    report_type?: string;
    report_type_name?: string;
    threshold: string | number;
    unit: string;
    channel: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface ReportTypeResponseApiDto {
    error: boolean;
    message: string;
    data: ReportTypeItemApiDto[];
}
