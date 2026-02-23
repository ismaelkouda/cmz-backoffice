export interface AgentsPerformancesFindOneFilterApiDto {
    uniq_id: string;
    search?: string;
    report_type?: string;
    operators?: string[];
    start_date?: Date;
    end_date?: Date;
}
