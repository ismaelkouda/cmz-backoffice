export interface ReportTypeItemApiDto {
    id: number;
    code: string;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    report_slas_count: number;
}

export interface ReportTypeResponseApiDto {
    error: boolean;
    message: string;
    data: ReportTypeItemApiDto[];
}
