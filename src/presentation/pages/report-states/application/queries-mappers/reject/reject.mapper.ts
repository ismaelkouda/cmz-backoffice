import { RejectQuery } from '@pages/report-states/application/queries/reject/reject.query';

export function rejectQueryMapper(query: RejectQuery) {
    return {
        initiatorPhoneNumber: query.initiatorPhoneNumber,
        uniqId: query.uniqId,
        reportType: query.reportType,
        operators: query.operators,
        source: query.source,
        status: query.status,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
