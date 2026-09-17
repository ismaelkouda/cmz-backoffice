import { AdmissibleQuery } from '@pages/report-states/application/queries/admissible/admissible.query';

export function admissibleQueryMapper(query: AdmissibleQuery) {
    return {
        initiatorPhoneNumber: query.initiatorPhoneNumber,
        uniqId: query.uniqId,
        requestReportUniqId: query.requestReportUniqId,
        reportType: query.reportType,
        operators: query.operators,
        source: query.source,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
