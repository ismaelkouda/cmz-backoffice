import { ApproveDownloadContract } from '@pages/report-states/domain/contracts/approve/approve-download.contract';
import { validateApproveDownload } from '@pages/report-states/domain/validators/approve/approve-download.validator';

export function approveDownloadVo(
    contract: ApproveDownloadContract
): ApproveDownloadContract {
    validateApproveDownload(contract);
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
