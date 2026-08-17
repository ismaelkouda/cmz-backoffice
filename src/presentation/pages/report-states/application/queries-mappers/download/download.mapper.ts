import { DownloadQuery } from '@pages/report-states/application/queries/download/download.query';

export function downloadQueryMapper(query: DownloadQuery) {
    return {
        search: query.search,
        date: query.date,
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
