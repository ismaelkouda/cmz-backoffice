import { CloseFilterContract } from '@pages/report-states/domain/contracts/close/close-filter.contract';

export function closeFilterEntity(
    contract: CloseFilterContract
): CloseFilterContract {
    const endDateRule =
        contract.startDate && !contract.endDate ? new Date() : contract.endDate;
    return {
        ...contract,
        endDate: endDateRule,
    };
}
