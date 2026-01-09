export interface TasksRequestDto {
    start_date?: string;
    end_date?: string;
    report_type?: string;
    state?: string;
    operator?: string[];
}
