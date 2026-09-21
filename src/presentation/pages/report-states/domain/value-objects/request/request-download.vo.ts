import { RequestDownloadContract } from '@pages/report-states/domain/contracts/request/request-download.contract';
import { validateRequestDownload } from '@pages/report-states/domain/validators/request/request-download.validator';

export function requestDownloadVo(
    contract: RequestDownloadContract
): RequestDownloadContract {
    validateRequestDownload(contract);
    return {
        metaData: {
            source: contract.metaData.source,
        },
        format: contract.format,
        initiatorPhoneNumber: contract.initiatorPhoneNumber,
        uniqId: contract.uniqId,
        requestReportUniqId: contract.requestReportUniqId,
        reportType: contract.reportType,
        operators: contract.operators,
        source: contract.source,
        startDate: contract.startDate,
        endDate: contract.endDate,
    };
}
