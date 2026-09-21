import { RequestDownloadQuery } from '@pages/report-states/application/queries/request/request-download.query';
import { DownloadSource } from '@presentation/pages/report-states/domain/enums/download-source.enum';

export function requestDownloadQueryMapper(query: RequestDownloadQuery) {
    return {
        metaData: {
            source: DownloadSource.REQUEST,
        },
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
