import { AllDownloadQuery } from '@pages/report-states/application/queries/all/all-download.query';

export function allDownloadQueryMapper(query: AllDownloadQuery) {
    return {
        format: query.format,
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
