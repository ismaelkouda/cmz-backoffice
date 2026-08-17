import { TasksActionsQuery } from '@pages/processing/application/queries/tasks/tasks-actions.query';

export function tasksActionsQueryMapper(query: TasksActionsQuery) {
    return {
        uniqId: query.uniqId,
    };
}
