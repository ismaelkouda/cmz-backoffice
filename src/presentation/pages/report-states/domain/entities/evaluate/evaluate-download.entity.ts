import { EvaluateDownloadContract } from '@pages/report-states/domain/contracts/evaluate/evaluate-download.contract';

export class EvaluateDownloadEntity {
    constructor(private readonly contract: EvaluateDownloadContract) {}

    get data(): EvaluateDownloadContract {
        return this.contract;
    }
}
