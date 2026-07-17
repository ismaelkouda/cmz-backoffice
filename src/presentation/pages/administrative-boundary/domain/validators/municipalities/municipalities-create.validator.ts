import { MunicipalitiesCreateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-create.contract';
import { MunicipalitiesCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateMunicipalitiesCreate(
    contract: MunicipalitiesCreateContract
): asserts contract is MunicipalitiesCreateValidateContract {
    if (!contract.code) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.ERROR.CREATE.CODE_REQUIRE'
        );
    }
    if (contract.population === undefined || contract.population === null) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.ERROR.CREATE.POPULATION_REQUIRE'
        );
    }
    if (
        contract.infrastructure === undefined ||
        contract.infrastructure === null
    ) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.ERROR.CREATE.INFRASTRUCTURE_REQUIRE'
        );
    }
    if (!contract.name) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.ERROR.CREATE.NAME_REQUIRE'
        );
    }
    if (!contract.region) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.ERROR.CREATE.REGION_REQUIRE'
        );
    }
    if (!contract.department) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.ERROR.CREATE.DEPARTMENT_REQUIRE'
        );
    }
}
