import { MunicipalitiesUpdateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-update.contract';
import { MunicipalitiesUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateMunicipalitiesUpdate(
    contract: MunicipalitiesUpdateContract
): asserts contract is MunicipalitiesUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.code) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.ERROR.UPDATE.CODE_REQUIRE'
        );
    }
    if (contract.population === undefined || contract.population === null) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.ERROR.UPDATE.POPULATION_REQUIRE'
        );
    }
    if (
        contract.infrastructure === undefined ||
        contract.infrastructure === null
    ) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.ERROR.UPDATE.INFRASTRUCTURE_REQUIRE'
        );
    }
    if (!contract.name) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.ERROR.UPDATE.NAME_REQUIRE'
        );
    }
    if (!contract.region) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.ERROR.UPDATE.REGION_REQUIRE'
        );
    }
    if (!contract.department) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.ERROR.UPDATE.DEPARTMENT_REQUIRE'
        );
    }
}
