import { EvaluateDownloadContract } from '@pages/report-states/domain/contracts/evaluate/evaluate-download.contract';
import { EvaluateDownloadEntity } from '@pages/report-states/domain/entities/evaluate/evaluate-download.entity';

export function evaluateDownloadFactory(
    contract: EvaluateDownloadContract
): EvaluateDownloadEntity {
    // const normalizedSubject = contract.subject.trim();
    return new EvaluateDownloadEntity(contract);
}
