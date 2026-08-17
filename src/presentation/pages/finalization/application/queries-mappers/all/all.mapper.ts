import { AllQuery } from '@pages/finalization/application/queries/all/all.query';

export function allQueryMapper(query: AllQuery) {
    return {
        initiatorPhoneNumber: query.initiatorPhoneNumber,
        uniqId: query.uniqId,
        reportType: query.reportType,
        operators: query.operators,
        source: query.source,
        state: query.state,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
