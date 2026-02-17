export interface TasksActionsUpdateDto {
    uniqId: string;
    reportUniqId: string;
    date: string;
    type: string;
    description: string;
    shouldNotifyUser: boolean;
}
