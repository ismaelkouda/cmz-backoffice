import { RequestQuery } from '@pages/report-states/application/queries/request/request.query';

export function requestQueryMapper(query: RequestQuery) {
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
