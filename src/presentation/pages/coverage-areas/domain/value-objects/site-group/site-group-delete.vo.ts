import { SiteGroupDeleteContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-delete.contract';
import { SiteGroupDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-delete.validate-contract';
import { validateSiteGroupDelete } from '@pages/coverage-areas/domain/validators/site-group/site-group-delete.validator';

export function siteGroupDeleteVo(
    contract: SiteGroupDeleteContract
): SiteGroupDeleteValidateContract {
    validateSiteGroupDelete(contract);
    return contract;
}
