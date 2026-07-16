import { TasksActionsDeleteCommand } from '@pages/processing/application/commands/tasks/tasks-actions-delete.command';

export function tasksActionsDeleteCommandMapper(
    command: TasksActionsDeleteCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
