import { SiteGroupEnableContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-enable.contract';
import { SiteGroupEnableValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-enable.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateSiteGroupEnable(
    contract: SiteGroupEnableContract
): asserts contract is SiteGroupEnableValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.SITE_GROUP.FORM.ERROR.ENABLE.UNIQ_ID_REQUIRE'
        );
    }
}
