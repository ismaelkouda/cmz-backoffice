import { SiteGroupEnableContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-enable.contract';
import { SiteGroupEnableValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-enable.validate-contract';
import { validateSiteGroupEnable } from '@pages/coverage-areas/domain/validators/site-group/site-group-enable.validator';

export function siteGroupEnableVo(
    contract: SiteGroupEnableContract
): SiteGroupEnableValidateContract {
    validateSiteGroupEnable(contract);
    return contract;
}
