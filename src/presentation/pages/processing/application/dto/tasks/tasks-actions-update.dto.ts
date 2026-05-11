export interface TasksActionsUpdateDto {
    uniqId: string;
    reportUniqId: string;
    date: Date | null;
    type: string;
    operator: string;
    description: string;
    shouldNotifyUser: boolean;
    isConform: boolean;
}
