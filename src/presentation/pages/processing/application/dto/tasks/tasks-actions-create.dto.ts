export interface TasksActionsCreateDto {
    reportUniqId: string;
    date: Date | null;
    type: string;
    description: string;
    shouldNotifyUser: boolean;
}
