import { TasksQuery } from '@pages/requests/application/queries/tasks/tasks.query';

export function tasksQueryMapper(query: TasksQuery) {
    return {
        initiatorPhoneNumber: query.initiatorPhoneNumber,
        uniqId: query.uniqId,
        reportType: query.reportType,
        operators: query.operators,
        source: query.source,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
