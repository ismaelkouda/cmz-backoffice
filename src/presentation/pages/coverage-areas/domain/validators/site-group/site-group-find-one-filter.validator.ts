import { SiteGroupFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-find-one-filter.contract';
import { SiteGroupFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-find-one-filter.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateSiteGroupFindOneFilter(
    contract: SiteGroupFindOneFilterContract
): asserts contract is SiteGroupFindOneFilterValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.SITE_GROUP.FORM.ERROR.FIND_ONE.UNIQ_ID_REQUIRE'
        );
    }
}
