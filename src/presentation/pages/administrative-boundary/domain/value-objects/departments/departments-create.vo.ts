import { DepartmentsCreateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-create.contract';
import { DepartmentsCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-create.validate-contract';
import { validateDepartmentsCreate } from '@presentation/pages/administrative-boundary/domain/validators/departments/departments-create.validator';

export function departmentsCreateVo(
    contract: DepartmentsCreateContract
): DepartmentsCreateValidateContract {
    validateDepartmentsCreate(contract);
    return {
        code: contract.code,
        population: contract.population,
        infrastructure: contract.infrastructure,
        name: contract.name,
        region: contract.region,
        description: contract.description,
    };
}
