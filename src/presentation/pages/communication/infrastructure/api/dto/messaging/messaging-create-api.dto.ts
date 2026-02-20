export interface MessagingCreateApiDto {
    report_uniq_id: string;
    type: string;
    target_type: string;
    region: string;
    department: string;
    municipality: string;
    channels: string[];
    subject: string;
    content: string;
}
