export interface NotificationsRequestDto {
    start_date?: string;
    end_date?: string;
    report_type?: string;
    state?: string;
    status?: string;
    operators?: string[];
}
