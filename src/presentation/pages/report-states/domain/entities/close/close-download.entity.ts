import { CloseDownloadContract } from '@pages/report-states/domain/contracts/close/close-download.contract';

export class CloseDownloadEntity {
    constructor(private readonly contract: CloseDownloadContract) {}

    get data(): CloseDownloadContract {
        return this.contract;
    }
}
