import { MunicipalitiesUpdateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-update.contract';
import { MunicipalitiesUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-update.validate-contract';
import { validateMunicipalitiesUpdate } from '@presentation/pages/administrative-boundary/domain/validators/municipalities/municipalities-update.validator';

export function municipalitiesUpdateVo(
    contract: MunicipalitiesUpdateContract
): MunicipalitiesUpdateValidateContract {
    validateMunicipalitiesUpdate(contract);
    return {
        uniqId: contract.uniqId,
        code: contract.code,
        population: contract.population,
        infrastructure: contract.infrastructure,
        name: contract.name,
        region: contract.region,
        description: contract.description,
        department: contract.department,
    };
}
