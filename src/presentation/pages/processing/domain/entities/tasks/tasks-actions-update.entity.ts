import { TasksActionsUpdateVo } from '@pages/processing/domain/value-objects/tasks/tasks-actions-update.vo';

export class TasksActionsUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly reportUniqId: string,
        public readonly date: Date | null,
        public readonly type: string,
        public readonly description: string,
        public readonly shouldNotifyUser: boolean
    ) {}

    static fromVo(vo: TasksActionsUpdateVo): TasksActionsUpdateEntity {
        return new TasksActionsUpdateEntity(
            vo.uniqId,
            vo.reportUniqId,
            vo.date,
            vo.type,
            vo.description,
            vo.shouldNotifyUser
        );
    }
}
