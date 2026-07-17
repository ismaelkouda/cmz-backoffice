import { SiteGroupFilterContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-filter.contract';
import { assertValidDateRange } from '@shared/domain/validators/assert-valid-date-range.validator';

export function validateSiteGroupFilter(
    contract: SiteGroupFilterContract
): asserts contract is SiteGroupFilterContract {
    assertValidDateRange(contract?.startDate, contract?.endDate);
}
