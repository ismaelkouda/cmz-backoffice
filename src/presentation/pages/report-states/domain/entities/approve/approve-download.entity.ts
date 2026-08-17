import { ApproveDownloadContract } from '@pages/report-states/domain/contracts/approve/approve-download.contract';

export class ApproveDownloadEntity {
    constructor(private readonly contract: ApproveDownloadContract) {}

    get data(): ApproveDownloadContract {
        return this.contract;
    }
}
