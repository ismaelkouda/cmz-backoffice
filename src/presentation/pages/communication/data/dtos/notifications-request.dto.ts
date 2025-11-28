export interface NotificationsRequestDto {
    created_from?: string;
    created_to?: string;
    report_type?: string;
    state?: string;
    operators?: string[];
}
