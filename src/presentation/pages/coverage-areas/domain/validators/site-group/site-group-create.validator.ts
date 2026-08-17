import { SiteGroupCreateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-create.contract';
import { SiteGroupCreateValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateSiteGroupCreate(
    contract: SiteGroupCreateContract
): asserts contract is SiteGroupCreateValidateContract {
    if (!contract.code) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.SITE_GROUP.FORM.ERROR.CREATE.CODE_REQUIRE'
        );
    }
    if (!contract.name) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.SITE_GROUP.FORM.ERROR.CREATE.NAME_REQUIRE'
        );
    }
    if (!contract.color) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.SITE_GROUP.FORM.ERROR.CREATE.COLOR_REQUIRE'
        );
    }
}
