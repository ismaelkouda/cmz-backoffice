import { SiteGroupCreateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-create.contract';
import { SiteGroupCreateValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-create.validate-contract';
import { validateSiteGroupCreate } from '@pages/coverage-areas/domain/validators/site-group/site-group-create.validator';

export function siteGroupCreateVo(
    contract: SiteGroupCreateContract
): SiteGroupCreateValidateContract {
    validateSiteGroupCreate(contract);
    return {
        code: contract.code,
        name: contract.name,
        description: contract.description,
        color: contract.color,
    };
}
