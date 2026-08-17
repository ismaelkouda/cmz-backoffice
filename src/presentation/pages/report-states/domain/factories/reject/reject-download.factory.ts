import { RejectDownloadContract } from '@pages/report-states/domain/contracts/reject/reject-download.contract';
import { RejectDownloadEntity } from '@pages/report-states/domain/entities/reject/reject-download.entity';

export function rejectDownloadFactory(
    contract: RejectDownloadContract
): RejectDownloadEntity {
    return new RejectDownloadEntity(contract);
}
