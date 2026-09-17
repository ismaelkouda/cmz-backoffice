import { AdmissibleDownloadContract } from '@pages/report-states/domain/contracts/admissible/admissible-download.contract';
import { AdmissibleDownloadEntity } from '@presentation/pages/report-states/domain/entities/admissible/admissible-download.entity';

export function admissibleDownloadFactory(
    contract: AdmissibleDownloadContract
): AdmissibleDownloadEntity {
    return new AdmissibleDownloadEntity(contract);
}
