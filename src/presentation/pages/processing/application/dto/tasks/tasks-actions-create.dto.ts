export interface TasksActionsCreateDto {
    reportUniqId: string;
    date: string;
    type: string;
    description: string;
    shouldNotifyUser: boolean;
}
