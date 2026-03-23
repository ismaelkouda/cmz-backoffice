export interface TasksActionsUpdateDto {
    uniqId: string;
    reportUniqId: string;
    date: Date | null;
    type: string;
    description: string;
    shouldNotifyUser: boolean;
}
