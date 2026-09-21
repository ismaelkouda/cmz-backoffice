import { RequestFilterContract } from '@presentation/pages/report-states/domain/contracts/request/request-filter.contract';
import { DateRangeInvalidError } from '@shared/domain/errors/validation/date-range-invalid.error';

export function validateRequestFilter(
    contract: RequestFilterContract
): asserts contract is RequestFilterContract {
    if (
        contract &&
        contract.startDate &&
        contract.endDate &&
        contract.startDate.getTime() > contract.endDate.getTime()
    ) {
        throw new DateRangeInvalidError();
    }
}
