export interface NewspapersRequestDto {
    report_uniq_id: string;
    created_from?: string;
    created_to?: string;
    report_type?: string;
    state?: string;
    operator?: string;
}
