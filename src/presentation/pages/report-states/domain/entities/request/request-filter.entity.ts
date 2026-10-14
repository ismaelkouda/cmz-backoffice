import { RequestFilterContract } from '@pages/report-states/domain/contracts/request/request-filter.contract';

export function requestFilterEntity(
    contract: RequestFilterContract
): RequestFilterContract {
    const endDateRule =
        contract.startDate && !contract.endDate ? new Date() : contract.endDate;
    return {
        ...contract,
        endDate: endDateRule,
    };
}
