import { DepartmentsUpdateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-update.contract';
import { DepartmentsUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-update.validate-contract';
import { validateDepartmentsUpdate } from '@presentation/pages/administrative-boundary/domain/validators/departments/departments-update.validator';

export function departmentsUpdateVo(
    contract: DepartmentsUpdateContract
): DepartmentsUpdateValidateContract {
    validateDepartmentsUpdate(contract);
    return {
        uniqId: contract.uniqId,
        code: contract.code,
        population: contract.population,
        infrastructure: contract.infrastructure,
        name: contract.name,
        region: contract.region,
        description: contract.description,
    };
}
