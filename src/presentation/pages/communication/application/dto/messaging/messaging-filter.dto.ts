export interface MessagingFilterDto {
    search?: string;
    targetType?: string;
    region?: string;
    department?: string;
    municipality?: string;
    channels?: string[];
    startDate?: string;
    endDate?: string;
}
