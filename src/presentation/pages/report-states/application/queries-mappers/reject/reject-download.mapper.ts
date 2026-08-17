import { RejectDownloadQuery } from '@pages/report-states/application/queries/reject/reject-download.query';
import { DownloadSource } from '@presentation/pages/report-states/domain/enums/download-source.enum';

export function rejectDownloadQueryMapper(query: RejectDownloadQuery) {
    return {
        metaData: {
            source: DownloadSource.REQUEST,
        },
        format: query.format,
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
