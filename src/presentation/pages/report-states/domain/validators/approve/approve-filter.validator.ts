import { ApproveFilterContract } from '@presentation/pages/report-states/domain/contracts/approve/approve-filter.contract';
import { DateRangeInvalidError } from '@shared/domain/errors/validation/date-range-invalid.error';

export function validateApproveFilter(
    contract: ApproveFilterContract
): asserts contract is ApproveFilterContract {
    if (
        contract &&
        contract.startDate &&
        contract.endDate &&
        contract.startDate.getTime() > contract.endDate.getTime()
    ) {
        throw new DateRangeInvalidError();
    }
}
