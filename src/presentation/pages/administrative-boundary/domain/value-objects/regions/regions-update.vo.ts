import { RegionsUpdateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-update.contract';
import { RegionsUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-update.validate-contract';
import { validateRegionsUpdate } from '@presentation/pages/administrative-boundary/domain/validators/regions/regions-update.validator';

export function regionsUpdateVo(
    contract: RegionsUpdateContract
): RegionsUpdateValidateContract {
    validateRegionsUpdate(contract);
    return {
        uniqId: contract.uniqId,
        code: contract.code,
        population: contract.population,
        infrastructure: contract.infrastructure,
        name: contract.name,
        description: contract.description,
    };
}
