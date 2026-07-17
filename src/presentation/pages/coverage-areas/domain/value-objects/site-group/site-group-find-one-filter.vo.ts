import { SiteGroupFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-find-one-filter.contract';
import { SiteGroupFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-find-one-filter.validate-contract';
import { validateSiteGroupFindOneFilter } from '@pages/coverage-areas/domain/validators/site-group/site-group-find-one-filter.validator';

export function siteGroupFindOneFilterVo(
    contract: SiteGroupFindOneFilterContract
): SiteGroupFindOneFilterValidateContract {
    validateSiteGroupFindOneFilter(contract);
    return contract;
}
