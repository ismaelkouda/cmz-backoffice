import { CloseFilterContract } from '@presentation/pages/report-states/domain/contracts/close/close-filter.contract';
import { DateRangeInvalidError } from '@shared/domain/errors/validation/date-range-invalid.error';

export function validateCloseFilter(
    contract: CloseFilterContract
): asserts contract is CloseFilterContract {
    if (
        contract &&
        contract.startDate &&
        contract.endDate &&
        contract.startDate.getTime() > contract.endDate.getTime()
    ) {
        throw new DateRangeInvalidError();
    }
}
