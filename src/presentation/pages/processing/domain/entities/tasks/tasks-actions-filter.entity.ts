import { TasksActionsFilterVo } from '@presentation/pages/processing/domain/value-objects/tasks/tasks-actions-filter.vo';

export class TasksActionsFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: TasksActionsFilterVo): TasksActionsFilterEntity {
        return new TasksActionsFilterEntity(vo.uniqId);
    }

    appliesToAdminScope(): boolean {
        return this.uniqId === 'ADMIN_ACTION';
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
        });
    }
}
