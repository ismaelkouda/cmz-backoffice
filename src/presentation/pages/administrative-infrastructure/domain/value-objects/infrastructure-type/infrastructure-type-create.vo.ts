import { InfrastructureTypeCreateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-create.contract';
import { InfrastructureTypeCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-create.validate-contract';
import { validateInfrastructureTypeCreate } from '@presentation/pages/administrative-infrastructure/domain/validators/infrastructure-type/infrastructure-type-create.validator';

export function infrastructureTypeCreateVo(
    contract: InfrastructureTypeCreateContract
): InfrastructureTypeCreateValidateContract {
    validateInfrastructureTypeCreate(contract);
    return {
        name: contract.name,
        description: contract.description,
        tag: contract.tag,
    };
}
