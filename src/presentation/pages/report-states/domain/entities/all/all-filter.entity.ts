import { AllFilterContract } from '@pages/report-states/domain/contracts/all/all-filter.contract';

export function allFilterEntity(
    contract: AllFilterContract
): AllFilterContract {
    const endDateRule =
        contract.startDate && !contract.endDate ? new Date() : contract.endDate;
    return {
        ...contract,
        endDate: endDateRule,
    };
}
