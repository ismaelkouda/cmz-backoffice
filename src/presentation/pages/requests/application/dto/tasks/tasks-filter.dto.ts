export interface TasksFilterDto {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    startDate?: string;
    endDate?: string;
    reportType?: string;
    operators?: string[];
    source?: string;
}
