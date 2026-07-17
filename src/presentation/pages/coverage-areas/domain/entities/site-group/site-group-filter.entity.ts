import { SiteGroupFilterContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-filter.contract';
import { resolveOpenEndedEndDate } from '@shared/domain/utils/resolve-open-ended-end-date.util';

export function siteGroupFilterEntity(
    contract: SiteGroupFilterContract
): SiteGroupFilterContract {
    return {
        ...contract,
        endDate: resolveOpenEndedEndDate(contract.startDate, contract.endDate),
    };
}
