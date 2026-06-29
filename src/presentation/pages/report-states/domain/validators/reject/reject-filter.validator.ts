import { RejectFilterContract } from '@presentation/pages/report-states/domain/contracts/reject/reject-filter.contract';
import { DateRangeInvalidError } from '@shared/domain/errors/validation/date-range-invalid.error';

export function validateRejectFilter(
    contract: RejectFilterContract
): asserts contract is RejectFilterContract {
    if (
        contract &&
        contract.startDate &&
        contract.endDate &&
        contract.startDate.getTime() > contract.endDate.getTime()
    ) {
        throw new DateRangeInvalidError();
    }
}
