export interface TasksActionsCreateDto {
    reportUniqId: string;
    date: Date | null;
    type: string;
    operator: string;
    description: string;
    shouldNotifyUser: boolean;
    isConform: boolean;
}
