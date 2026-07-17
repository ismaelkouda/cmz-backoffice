import { DepartmentsCreateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-create.contract';
import { DepartmentsCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateDepartmentsCreate(
    contract: DepartmentsCreateContract
): asserts contract is DepartmentsCreateValidateContract {
    if (!contract.code) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.ERROR.CREATE.CODE_REQUIRE'
        );
    }
    if (contract.population === undefined || contract.population === null) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.ERROR.CREATE.POPULATION_REQUIRE'
        );
    }
    if (
        contract.infrastructure === undefined ||
        contract.infrastructure === null
    ) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.ERROR.CREATE.INFRASTRUCTURE_REQUIRE'
        );
    }
    if (!contract.name) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.ERROR.CREATE.NAME_REQUIRE'
        );
    }
    if (!contract.region) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.ERROR.CREATE.REGION_REQUIRE'
        );
    }
}
