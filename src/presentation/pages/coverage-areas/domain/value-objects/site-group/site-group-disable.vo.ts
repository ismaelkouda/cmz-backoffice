import { SiteGroupDisableContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-disable.contract';
import { SiteGroupDisableValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-disable.validate-contract';
import { validateSiteGroupDisable } from '@pages/coverage-areas/domain/validators/site-group/site-group-disable.validator';

export function siteGroupDisableVo(
    contract: SiteGroupDisableContract
): SiteGroupDisableValidateContract {
    validateSiteGroupDisable(contract);
    return contract;
}
