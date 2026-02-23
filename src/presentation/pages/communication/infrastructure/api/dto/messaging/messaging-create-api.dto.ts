export interface MessagingCreateApiDto {
    report_uniq_id: string;
    type: string;
    target_type: string;
    region_id: string;
    department_id: string;
    municipality_id: string;
    channels: string[];
    subject: string;
    content: string;
}
