import { AdmissibleFilterContract } from '@pages/report-states/domain/contracts/admissible/admissible-filter.contract';

export function admissibleFilterEntity(
    contract: AdmissibleFilterContract
): AdmissibleFilterContract {
    const endDateRule =
        contract.startDate && !contract.endDate ? new Date() : contract.endDate;
    return {
        ...contract,
        endDate: endDateRule,
    };
}
