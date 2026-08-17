import { SlideFilterContract } from '@pages/content-management/domain/contracts/slide/slide-filter.contract';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export function validateSlideFilter(
    contract: SlideFilterContract
): asserts contract is SlideFilterContract {
    if (contract?.startDate || contract?.endDate) {
        DatePeriod.create(contract.startDate, contract.endDate);
    }
}
