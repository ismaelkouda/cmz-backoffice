import { MunicipalitiesCreateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-create.contract';
import { MunicipalitiesCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-create.validate-contract';
import { validateMunicipalitiesCreate } from '@presentation/pages/administrative-boundary/domain/validators/municipalities/municipalities-create.validator';

export function municipalitiesCreateVo(
    contract: MunicipalitiesCreateContract
): MunicipalitiesCreateValidateContract {
    validateMunicipalitiesCreate(contract);
    return {
        code: contract.code,
        population: contract.population,
        infrastructure: contract.infrastructure,
        name: contract.name,
        region: contract.region,
        description: contract.description,
        department: contract.department,
    };
}
