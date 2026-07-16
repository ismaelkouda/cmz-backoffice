import { InfrastructureTypeUpdateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-update.contract';
import { InfrastructureTypeUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-update.validate-contract';
import { validateInfrastructureTypeUpdate } from '@presentation/pages/administrative-infrastructure/domain/validators/infrastructure-type/infrastructure-type-update.validator';

export function infrastructureTypeUpdateVo(
    contract: InfrastructureTypeUpdateContract
): InfrastructureTypeUpdateValidateContract {
    validateInfrastructureTypeUpdate(contract);
    return {
        uniqId: contract.uniqId,
        name: contract.name,
        description: contract.description,
    };
}
