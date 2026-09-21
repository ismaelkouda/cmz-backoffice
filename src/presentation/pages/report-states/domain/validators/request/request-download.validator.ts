import { RequestDownloadContract } from '@pages/report-states/domain/contracts/request/request-download.contract';
import { RequestContractRequiredError } from '@pages/report-states/domain/errors/request/request-contract.error';
import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';
import { DownloadTypeRequiredError } from '@shared/domain/errors/validation/download-type.error';

export function validateRequestDownload(
    contract: RequestDownloadContract
): asserts contract is RequestDownloadContract {
    if (!contract) {
        throw new RequestContractRequiredError();
    }
    const hasAtLeastOneValue = Object.values(contract).some((v) => {
        if (Array.isArray(v)) {
            return v.length > 0;
        }
        return v !== null && v !== undefined && v !== '';
    });
    if (!hasAtLeastOneValue) {
        throw new RequestContractRequiredError();
    }
    const validFormat = Object.values(DownloadType);
    if (contract.format && !validFormat.includes(contract.format)) {
        throw new DownloadTypeRequiredError();
    }
}
