import { SiteGroupDeleteContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-delete.contract';
import { SiteGroupDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-delete.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateSiteGroupDelete(
    contract: SiteGroupDeleteContract
): asserts contract is SiteGroupDeleteValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.SITE_GROUP.FORM.ERROR.DELETE.UNIQ_ID_REQUIRE'
        );
    }
}
