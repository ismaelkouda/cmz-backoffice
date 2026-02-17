import { TasksActionsCreateVo } from '@presentation/pages/processing/domain/value-objects/tasks/tasks-actions-create.vo';

export class TasksActionsCreateEntity {
    constructor(
        public readonly date: string,
        public readonly type: string,
        public readonly description: string,
        public readonly shouldNotifyUser: boolean
    ) {}

    static fromVo(vo: TasksActionsCreateVo): TasksActionsCreateEntity {
        return new TasksActionsCreateEntity(
            vo.date,
            vo.type,
            vo.description,
            vo.shouldNotifyUser
        );
    }
}
