import { TasksActionsCreateCommand } from '@pages/processing/application/commands/tasks/tasks-actions-create.command';

export function tasksActionsCreateCommandMapper(
    command: TasksActionsCreateCommand
) {
    return {
        reportUniqId: command.reportUniqId,
        date: command.date,
        type: command.type,
        operator: command.operator,
        description: command.description,
        shouldNotifyUser: command.shouldNotifyUser,
        isConform: command.isConform,
    };
}
