import { InfrastructureUpdateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-update.contract';
import { validateInfrastructureUpdate } from '@presentation/pages/administrative-infrastructure/domain/validators/infrastructure/infrastructure-update.validator';
import { InfrastructureUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-update.validate-contract';

export function infrastructureUpdateVo(
    contract: InfrastructureUpdateContract
): InfrastructureUpdateValidateContract {
    validateInfrastructureUpdate(contract);
    return {
        uniqId: contract.uniqId,
        name: contract.name,
        type: contract.type,
        position: contract.position,
        description: contract.description,
    };
}
