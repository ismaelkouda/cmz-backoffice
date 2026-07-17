import { RegionsUpdateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-update.contract';
import { RegionsUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateRegionsUpdate(
    contract: RegionsUpdateContract
): asserts contract is RegionsUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.code) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.ERROR.UPDATE.CODE_REQUIRE'
        );
    }
    if (contract.population === undefined || contract.population === null) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.ERROR.UPDATE.POPULATION_REQUIRE'
        );
    }
    if (
        contract.infrastructure === undefined ||
        contract.infrastructure === null
    ) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.ERROR.UPDATE.INFRASTRUCTURE_REQUIRE'
        );
    }
    if (!contract.name) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.ERROR.UPDATE.NAME_REQUIRE'
        );
    }
}
