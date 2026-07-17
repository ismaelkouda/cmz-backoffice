import { HomeFilterContract } from '@pages/content-management/domain/contracts/home/home-filter.contract';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export function validateHomeFilter(
    contract: HomeFilterContract
): asserts contract is HomeFilterContract {
    if (contract?.startDate || contract?.endDate) {
        DatePeriod.create(contract.startDate, contract.endDate);
    }
}
