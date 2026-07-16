import { AllQuery } from '@pages/requests/application/queries/all/all.query';

export function allQueryMapper(query: AllQuery) {
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
