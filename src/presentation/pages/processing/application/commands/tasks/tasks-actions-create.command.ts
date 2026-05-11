export class TasksActionsCreateCommand {
    constructor(
        public readonly reportUniqId: string,
        public readonly date: Date | null,
        public readonly type: string,
        public readonly operator: string,
        public readonly description: string,
        public readonly shouldNotifyUser: boolean,
        public readonly isConform: boolean
    ) {}
}
