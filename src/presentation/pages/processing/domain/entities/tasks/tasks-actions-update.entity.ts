import { TasksActionsUpdateVo } from '@pages/processing/domain/value-objects/tasks/tasks-actions-update.vo';

import { Conformity } from '../../enums/tasks/tasks-actions-conformity.enum';

export class TasksActionsUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly reportUniqId: string,
        public readonly date: Date | null,
        public readonly type: string,
        public readonly operator: string,
        public readonly description: string,
        public readonly shouldNotifyUser: boolean,
        public readonly isConform: Conformity
    ) {}

    static fromVo(vo: TasksActionsUpdateVo): TasksActionsUpdateEntity {
        return new TasksActionsUpdateEntity(
            vo.uniqId,
            vo.reportUniqId,
            vo.date,
            vo.type,
            vo.operator,
            vo.description,
            vo.shouldNotifyUser,
            vo.isConform
        );
    }
}
