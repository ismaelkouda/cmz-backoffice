export class TasksActionsCreateCommand {
    constructor(
        public readonly reportUniqId: string,
        public readonly date: string,
        public readonly type: string,
        public readonly description: string,
        public readonly shouldNotifyUser: boolean
    ) {}
}
