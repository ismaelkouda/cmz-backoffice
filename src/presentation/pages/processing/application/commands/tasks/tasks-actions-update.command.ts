export class TasksActionsUpdateCommand {
    constructor(
        public readonly uniqId: string,
        public readonly reportUniqId: string,
        public readonly date: string,
        public readonly type: string,
        public readonly description: string,
        public readonly shouldNotifyUser: boolean
    ) {}
}
