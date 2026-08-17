import { RegionsCreateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-create.contract';
import { RegionsCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-create.validate-contract';
import { validateRegionsCreate } from '@presentation/pages/administrative-boundary/domain/validators/regions/regions-create.validator';

export function regionsCreateVo(
    contract: RegionsCreateContract
): RegionsCreateValidateContract {
    validateRegionsCreate(contract);
    return {
        code: contract.code,
        population: contract.population,
        infrastructure: contract.infrastructure,
        name: contract.name,
        description: contract.description,
    };
}
