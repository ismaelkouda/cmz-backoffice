import { EvaluateFilterContract } from '@pages/report-states/domain/contracts/evaluate/evaluate-filter.contract';
import { validateEvaluateFilter } from '@pages/report-states/domain/validators/evaluate/evaluate-filter.validator';

export function evaluateFilterVo(
    contract: EvaluateFilterContract
): EvaluateFilterContract {
    validateEvaluateFilter(contract);
    return contract;
}
