import { EvaluateDownloadQuery } from '@pages/report-states/application/queries/evaluate/evaluate-download.query';
import { DownloadSource } from '@presentation/pages/report-states/domain/enums/download-source.enum';

export function evaluateDownloadQueryMapper(query: EvaluateDownloadQuery) {
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
