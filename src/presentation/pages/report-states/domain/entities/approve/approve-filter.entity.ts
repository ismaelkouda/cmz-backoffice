import { ApproveFilterContract } from '@pages/report-states/domain/contracts/approve/approve-filter.contract';

export function approveFilterEntity(
    contract: ApproveFilterContract
): ApproveFilterContract {
    const endDateRule =
        contract.startDate && !contract.endDate ? new Date() : contract.endDate;
    return {
        ...contract,
        endDate: endDateRule,
    };
}
