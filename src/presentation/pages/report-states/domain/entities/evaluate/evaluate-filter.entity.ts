import { EvaluateFilterContract } from '@pages/report-states/domain/contracts/evaluate/evaluate-filter.contract';

export function evaluateFilterEntity(
    contract: EvaluateFilterContract
): EvaluateFilterContract {
    const endDateRule =
        contract.startDate && !contract.endDate ? new Date() : contract.endDate;
    return {
        ...contract,
        endDate: endDateRule,
    };
}
