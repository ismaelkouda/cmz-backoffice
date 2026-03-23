import { TasksActionsCreateVo } from '@pages/processing/domain/value-objects/tasks/tasks-actions-create.vo';

export class TasksActionsCreateEntity {
    constructor(
        public readonly reportUniqId: string,
        public readonly date: Date | null,
        public readonly type: string,
        public readonly description: string,
        public readonly shouldNotifyUser: boolean
    ) {}

    static fromVo(vo: TasksActionsCreateVo): TasksActionsCreateEntity {
        return new TasksActionsCreateEntity(
            vo.reportUniqId,
            vo.date,
            vo.type,
            vo.description,
            vo.shouldNotifyUser
        );
    }
}
