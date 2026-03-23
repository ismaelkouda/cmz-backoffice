export interface TasksActionsUpdateApiDto {
    uniq_id: string;
    report_uniq_id: string;
    date: Date;
    type: string;
    description: string;
    should_notify_user: boolean;
}
