import { ApproveQuery } from '@pages/report-states/application/queries/approve/approve.query';

export function approveQueryMapper(query: ApproveQuery) {
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
