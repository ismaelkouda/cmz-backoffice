import { EvaluateDownloadContract } from '@pages/report-states/domain/contracts/evaluate/evaluate-download.contract';
import { validateEvaluateDownload } from '@pages/report-states/domain/validators/evaluate/evaluate-download.validator';

export function evaluateDownloadVo(
    contract: EvaluateDownloadContract
): EvaluateDownloadContract {
    validateEvaluateDownload(contract);
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
