import { DepartmentsUpdateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-update.contract';
import { DepartmentsUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateDepartmentsUpdate(
    contract: DepartmentsUpdateContract
): asserts contract is DepartmentsUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.code) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.ERROR.UPDATE.CODE_REQUIRE'
        );
    }
    if (contract.population === undefined || contract.population === null) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.ERROR.UPDATE.POPULATION_REQUIRE'
        );
    }
    if (
        contract.infrastructure === undefined ||
        contract.infrastructure === null
    ) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.ERROR.UPDATE.INFRASTRUCTURE_REQUIRE'
        );
    }
    if (!contract.name) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.ERROR.UPDATE.NAME_REQUIRE'
        );
    }
    if (!contract.region) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.ERROR.UPDATE.REGION_REQUIRE'
        );
    }
}
