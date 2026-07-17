import { SiteGroupDisableContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-disable.contract';
import { SiteGroupDisableValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-disable.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateSiteGroupDisable(
    contract: SiteGroupDisableContract
): asserts contract is SiteGroupDisableValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.SITE_GROUP.FORM.ERROR.DISABLE.UNIQ_ID_REQUIRE'
        );
    }
}
