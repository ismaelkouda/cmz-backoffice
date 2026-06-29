import { EvaluateDownloadContract } from '@pages/report-states/domain/contracts/evaluate/evaluate-download.contract';
import { ContractRequiredError } from '@pages/report-states/domain/errors/evaluate/evaluate-contract.error';
import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';
import { DownloadTypeRequiredError } from '@shared/domain/errors/validation/download-type.error';

export function validateEvaluateDownload(
    contract: EvaluateDownloadContract
): asserts contract is EvaluateDownloadContract {
    if (!contract) {
        throw new ContractRequiredError();
    }
    const hasAtLeastOneValue = Object.values(contract).some((v) => {
        if (Array.isArray(v)) {
            return v.length > 0;
        }
        return v !== null && v !== undefined && v !== '';
    });
    if (!hasAtLeastOneValue) {
        throw new ContractRequiredError();
    }
    const validFormat = Object.values(DownloadType);
    if (contract.format && !validFormat.includes(contract.format)) {
        throw new DownloadTypeRequiredError();
    }
}
