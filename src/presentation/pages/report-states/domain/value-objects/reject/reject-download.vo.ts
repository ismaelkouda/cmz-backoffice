import { RejectDownloadContract } from '@pages/report-states/domain/contracts/reject/reject-download.contract';
import { validateRejectDownload } from '@pages/report-states/domain/validators/reject/reject-download.validator';

export function rejectDownloadVo(
    contract: RejectDownloadContract
): RejectDownloadContract {
    validateRejectDownload(contract);
    return {
        metaData: {
            source: contract.metaData.source,
        },
        format: contract.format,
        initiatorPhoneNumber: contract.initiatorPhoneNumber,
        uniqId: contract.uniqId,
        status: contract.status,
        reportType: contract.reportType,
        operators: contract.operators,
        source: contract.source,
        startDate: contract.startDate,
        endDate: contract.endDate,
    };
}
