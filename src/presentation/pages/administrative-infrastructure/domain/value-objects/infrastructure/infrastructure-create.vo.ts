import { InfrastructureCreateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-create.contract';
import { InfrastructureCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-create.validate-contract';
import { validateInfrastructureCreate } from '@presentation/pages/administrative-infrastructure/domain/validators/infrastructure/infrastructure-create.validator';

export function infrastructureCreateVo(
    contract: InfrastructureCreateContract
): InfrastructureCreateValidateContract {
    validateInfrastructureCreate(contract);
    return {
        name: contract.name,
        type: contract.type,
        position: contract.position,
        description: contract.description,
    };
}
