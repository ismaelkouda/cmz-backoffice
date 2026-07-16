import { NewsFilterContract } from '@pages/content-management/domain/contracts/news/news-filter.contract';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export function validateNewsFilter(
    contract: NewsFilterContract
): asserts contract is NewsFilterContract {
    if (contract?.startDate || contract?.endDate) {
        DatePeriod.create(contract.startDate, contract.endDate);
    }
}
