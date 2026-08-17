import { ApproveFilterContract } from '@pages/report-states/domain/contracts/approve/approve-filter.contract';
import { validateApproveFilter } from '@pages/report-states/domain/validators/approve/approve-filter.validator';

export function approveFilterVo(
    contract: ApproveFilterContract
): ApproveFilterContract {
    validateApproveFilter(contract);
    return contract;
}
