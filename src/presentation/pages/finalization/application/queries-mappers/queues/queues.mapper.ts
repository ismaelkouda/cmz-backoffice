import { QueuesQuery } from '@pages/finalization/application/queries/queues/queues.query';

export function queuesQueryMapper(query: QueuesQuery) {
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
