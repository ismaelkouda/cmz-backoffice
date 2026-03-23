export interface TasksActionsCreateApiDto {
    report_uniq_id: string;
    date: Date;
    type: string;
    description: string;
    should_notify_user: boolean;
}
