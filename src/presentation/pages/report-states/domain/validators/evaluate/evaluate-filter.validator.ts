import { EvaluateFilterContract } from '@presentation/pages/report-states/domain/contracts/evaluate/evaluate-filter.contract';
import { DateRangeInvalidError } from '@shared/domain/errors/validation/date-range-invalid.error';

export function validateEvaluateFilter(
    contract: EvaluateFilterContract
): asserts contract is EvaluateFilterContract {
    if (
        contract &&
        contract.startDate &&
        contract.endDate &&
        contract.startDate.getTime() > contract.endDate.getTime()
    ) {
        throw new DateRangeInvalidError();
    }
}
