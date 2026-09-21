import { RequestDownloadContract } from '@pages/report-states/domain/contracts/request/request-download.contract';
import { RequestDownloadEntity } from '@pages/report-states/domain/entities/request/request-download.entity';

export function requestDownloadFactory(
    contract: RequestDownloadContract
): RequestDownloadEntity {
    return new RequestDownloadEntity(contract);
}
