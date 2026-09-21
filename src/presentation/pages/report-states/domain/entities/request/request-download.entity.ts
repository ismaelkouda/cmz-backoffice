import { RequestDownloadContract } from '@pages/report-states/domain/contracts/request/request-download.contract';

export class RequestDownloadEntity {
    constructor(private readonly contract: RequestDownloadContract) {}

    get data(): RequestDownloadContract {
        return this.contract;
    }
}
