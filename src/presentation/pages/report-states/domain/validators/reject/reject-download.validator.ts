import { RejectDownloadContract } from '@pages/report-states/domain/contracts/reject/reject-download.contract';
import { Status } from '@pages/report-states/domain/enums/reject/reject-status.enum';
import { ContractRequiredError } from '@pages/report-states/domain/errors/reject/reject-contract.error';
import { StatusTypeRequiredError } from '@pages/report-states/domain/errors/reject/reject-status-type.error';
import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';
import { DownloadTypeRequiredError } from '@shared/domain/errors/validation/download-type.error';

export function validateRejectDownload(
    contract: RejectDownloadContract
): asserts contract is RejectDownloadContract {
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

    const validStatuses = Object.values(Status);
    if (contract.status && !validStatuses.includes(contract.status)) {
        throw new StatusTypeRequiredError();
    }
}
