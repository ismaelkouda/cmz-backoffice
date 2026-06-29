import { RejectFilterContract } from '@pages/report-states/domain/contracts/reject/reject-filter.contract';

export function rejectFilterEntity(
    contract: RejectFilterContract
): RejectFilterContract {
    const endDateRule =
        contract.startDate && !contract.endDate ? new Date() : contract.endDate;
    return {
        ...contract,
        endDate: endDateRule,
    };
}
