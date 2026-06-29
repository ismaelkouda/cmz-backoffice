import { RejectFilterContract } from '@pages/report-states/domain/contracts/reject/reject-filter.contract';
import { validateRejectFilter } from '@pages/report-states/domain/validators/reject/reject-filter.validator';

export function rejectFilterVo(
    contract: RejectFilterContract
): RejectFilterContract {
    validateRejectFilter(contract);
    return contract;
}
