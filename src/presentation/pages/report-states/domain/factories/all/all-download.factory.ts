import { AllDownloadContract } from '@pages/report-states/domain/contracts/all/all-download.contract';
import { AllDownloadEntity } from '@presentation/pages/report-states/domain/entities/all/all-download.entity';

export function allDownloadFactory(
    contract: AllDownloadContract
): AllDownloadEntity {
    return new AllDownloadEntity(contract);
}
