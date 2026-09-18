import { AllDownloadContract } from '@pages/report-states/domain/contracts/all/all-download.contract';

export class AllDownloadEntity {
    constructor(private readonly contract: AllDownloadContract) {}

    get data(): AllDownloadContract {
        return this.contract;
    }
}
