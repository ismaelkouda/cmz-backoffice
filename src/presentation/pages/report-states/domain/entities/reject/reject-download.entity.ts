import { RejectDownloadContract } from '@pages/report-states/domain/contracts/reject/reject-download.contract';

export class RejectDownloadEntity {
    constructor(private readonly contract: RejectDownloadContract) {}

    get data(): RejectDownloadContract {
        return this.contract;
    }
}
