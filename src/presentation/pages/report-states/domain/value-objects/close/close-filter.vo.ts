import { CloseFilterContract } from '@pages/report-states/domain/contracts/close/close-filter.contract';
import { validateCloseFilter } from '@pages/report-states/domain/validators/close/close-filter.validator';

export function closeFilterVo(
    contract: CloseFilterContract
): CloseFilterContract {
    validateCloseFilter(contract);
    return contract;
}
