export interface AgentsPerformancesFindOneFilterDto {
    uniqId: string;
    search?: string;
    reportType?: string;
    operators?: string[];
    startDate?: string;
    endDate?: string;
}
