import { TasksActionsUpdateCommand } from '@pages/processing/application/commands/tasks/tasks-actions-update.command';

export function tasksActionsUpdateCommandMapper(
    command: TasksActionsUpdateCommand
) {
    return {
        uniqId: command.uniqId,
        reportUniqId: command.reportUniqId,
        date: command.date,
        type: command.type,
        operator: command.operator,
        description: command.description,
        shouldNotifyUser: command.shouldNotifyUser,
        isConform: command.isConform,
    };
}
