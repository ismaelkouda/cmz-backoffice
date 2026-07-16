import { ApproveDownloadQuery } from '@pages/report-states/application/queries/approve/approve-download.query';
import { DownloadSource } from '@presentation/pages/report-states/domain/enums/download-source.enum';

export function approveDownloadQueryMapper(query: ApproveDownloadQuery) {
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
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
