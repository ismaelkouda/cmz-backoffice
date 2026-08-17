import { CloseDownloadContract } from '@pages/report-states/domain/contracts/close/close-download.contract';
import { validateCloseDownload } from '@pages/report-states/domain/validators/close/close-download.validator';

export function closeDownloadVo(
    contract: CloseDownloadContract
): CloseDownloadContract {
    validateCloseDownload(contract);
    return {
        metaData: {
            source: contract.metaData.source,
        },
        format: contract.format,
        initiatorPhoneNumber: contract.initiatorPhoneNumber,
        uniqId: contract.uniqId,
        reportType: contract.reportType,
        operators: contract.operators,
        source: contract.source,
        startDate: contract.startDate,
        endDate: contract.endDate,
    };
}
