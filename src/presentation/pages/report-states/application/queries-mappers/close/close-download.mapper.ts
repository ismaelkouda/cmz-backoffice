import { CloseDownloadQuery } from '@pages/report-states/application/queries/close/close-download.query';
import { DownloadSource } from '@presentation/pages/report-states/domain/enums/download-source.enum';

export function closeDownloadQueryMapper(query: CloseDownloadQuery) {
    return {
        metaData: {
            source: DownloadSource.REPORT,
        },
        format: query.format,
        initiatorPhoneNumber: query.initiatorPhoneNumber,
        uniqId: query.uniqId,
        reportType: query.reportType,
        operators: query.operators,
        source: query.source,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
