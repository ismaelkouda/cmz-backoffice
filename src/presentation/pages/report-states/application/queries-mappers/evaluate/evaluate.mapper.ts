import { EvaluateQuery } from '@pages/report-states/application/queries/evaluate/evaluate.query';

export function evaluateQueryMapper(query: EvaluateQuery) {
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
