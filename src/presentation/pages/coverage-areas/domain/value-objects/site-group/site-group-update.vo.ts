import { SiteGroupUpdateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-update.contract';
import { SiteGroupUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-update.validate-contract';
import { validateSiteGroupUpdate } from '@pages/coverage-areas/domain/validators/site-group/site-group-update.validator';

export function siteGroupUpdateVo(
    contract: SiteGroupUpdateContract
): SiteGroupUpdateValidateContract {
    validateSiteGroupUpdate(contract);
    return {
        uniqId: contract.uniqId,
        code: contract.code,
        name: contract.name,
        description: contract.description,
    };
}
