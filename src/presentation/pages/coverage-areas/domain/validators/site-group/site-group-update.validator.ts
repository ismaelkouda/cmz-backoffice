import { SiteGroupUpdateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-update.contract';
import { SiteGroupUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateSiteGroupUpdate(
    contract: SiteGroupUpdateContract
): asserts contract is SiteGroupUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.SITE_GROUP.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.code) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.SITE_GROUP.FORM.ERROR.UPDATE.CODE_REQUIRE'
        );
    }
    if (!contract.name) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.SITE_GROUP.FORM.ERROR.UPDATE.NAME_REQUIRE'
        );
    }
    if (!contract.color) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.SITE_GROUP.FORM.ERROR.UPDATE.COLOR_REQUIRE'
        );
    }
}
