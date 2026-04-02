export interface ChatbotFilterDto {
    reportId?: string;
    search?: string;
    targetType?: string;
    region?: string;
    department?: string;
    municipality?: string;
    channels?: string[];
    startDate?: string;
    endDate?: string;
}
