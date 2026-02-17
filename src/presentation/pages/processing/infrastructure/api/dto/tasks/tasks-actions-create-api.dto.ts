export interface TasksActionsCreateApiDto {
    date: string;
    type: string;
    description: string;
    should_notify_user: boolean;
}
