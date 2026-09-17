import { AdmissibleDownloadContract } from '@pages/report-states/domain/contracts/admissible/admissible-download.contract';

export class AdmissibleDownloadEntity {
    constructor(private readonly contract: AdmissibleDownloadContract) {}

    get data(): AdmissibleDownloadContract {
        return this.contract;
    }
}
