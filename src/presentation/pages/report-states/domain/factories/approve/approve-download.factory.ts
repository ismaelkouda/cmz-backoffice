import { ApproveDownloadContract } from '@pages/report-states/domain/contracts/approve/approve-download.contract';
import { ApproveDownloadEntity } from '@pages/report-states/domain/entities/approve/approve-download.entity';

export function approveDownloadFactory(
    contract: ApproveDownloadContract
): ApproveDownloadEntity {
    // const normalizedSubject = contract.subject.trim();
    return new ApproveDownloadEntity(contract);
}
