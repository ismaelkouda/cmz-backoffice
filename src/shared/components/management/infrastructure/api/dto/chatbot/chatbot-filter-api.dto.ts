export interface ChatbotFilterApiDto {
    report_id: string;
    search?: string;
    target_type?: string;
    region?: string;
    department?: string;
    municipality?: string;
    channels?: string[];
    start_date?: Date;
    end_date?: Date;
}
