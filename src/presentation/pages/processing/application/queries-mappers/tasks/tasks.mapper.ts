import { TasksQuery } from '@pages/processing/application/queries/tasks/tasks.query';

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
