import { CloseDownloadContract } from '@pages/report-states/domain/contracts/close/close-download.contract';
import { CloseDownloadEntity } from '@pages/report-states/domain/entities/close/close-download.entity';

export function closeDownloadFactory(
    contract: CloseDownloadContract
): CloseDownloadEntity {
    // const normalizedSubject = contract.subject.trim();
    return new CloseDownloadEntity(contract);
}
