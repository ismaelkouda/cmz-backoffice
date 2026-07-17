import { RegionsCreateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-create.contract';
import { RegionsCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateRegionsCreate(
    contract: RegionsCreateContract
): asserts contract is RegionsCreateValidateContract {
    if (!contract.code) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.ERROR.CREATE.CODE_REQUIRE'
        );
    }
    if (contract.population === undefined || contract.population === null) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.ERROR.CREATE.POPULATION_REQUIRE'
        );
    }
    if (
        contract.infrastructure === undefined ||
        contract.infrastructure === null
    ) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.ERROR.CREATE.INFRASTRUCTURE_REQUIRE'
        );
    }
    if (!contract.name) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.ERROR.CREATE.NAME_REQUIRE'
        );
    }
}
