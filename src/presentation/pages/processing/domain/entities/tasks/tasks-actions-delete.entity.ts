import { TasksActionsDeleteVo } from '@presentation/pages/processing/domain/value-objects/tasks/tasks-actions-delete.vo';

export class TasksActionsDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: TasksActionsDeleteVo): TasksActionsDeleteEntity {
        return new TasksActionsDeleteEntity(vo.uniqId);
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
