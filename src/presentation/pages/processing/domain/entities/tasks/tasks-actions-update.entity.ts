import { TasksActionsUpdateVo } from '@presentation/pages/processing/domain/value-objects/tasks/tasks-actions-update.vo';

export class TasksActionsUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly date: string,
        public readonly type: string,
        public readonly description: string,
        public readonly shouldNotifyUser: boolean
    ) {}

    static fromVo(vo: TasksActionsUpdateVo): TasksActionsUpdateEntity {
        return new TasksActionsUpdateEntity(
            vo.uniqId,
            vo.date,
            vo.type,
            vo.description,
            vo.shouldNotifyUser
        );
    }
}
