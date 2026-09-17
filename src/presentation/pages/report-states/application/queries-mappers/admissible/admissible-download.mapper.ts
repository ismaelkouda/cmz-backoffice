import { AdmissibleDownloadQuery } from '@pages/report-states/application/queries/admissible/admissible-download.query';

export function admissibleDownloadQueryMapper(query: AdmissibleDownloadQuery) {
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
