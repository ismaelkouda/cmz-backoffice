import { TasksActionsTypeFilterVo } from '@presentation/pages/processing/domain/value-objects/tasks/tasks-actions-type-filter.vo';

export class TasksActionsTypeFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: TasksActionsTypeFilterVo): TasksActionsTypeFilterEntity {
        return new TasksActionsTypeFilterEntity(vo.uniqId);
    }
}
