import { SiteGroupFilterContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-filter.contract';
import { validateSiteGroupFilter } from '@pages/coverage-areas/domain/validators/site-group/site-group-filter.validator';

export function siteGroupFilterVo(
    contract: SiteGroupFilterContract
): SiteGroupFilterContract {
    validateSiteGroupFilter(contract);
    return contract;
}
