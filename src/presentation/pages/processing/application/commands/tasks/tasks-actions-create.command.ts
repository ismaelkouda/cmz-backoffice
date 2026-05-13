import { Conformity } from '@presentation/pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';

export class TasksActionsCreateCommand {
    constructor(
        public readonly reportUniqId: string,
        public readonly date: Date | null,
        public readonly type: string,
        public readonly operator: string,
        public readonly description: string,
        public readonly shouldNotifyUser: boolean,
        public readonly isConform: Conformity | null
    ) {}
}
