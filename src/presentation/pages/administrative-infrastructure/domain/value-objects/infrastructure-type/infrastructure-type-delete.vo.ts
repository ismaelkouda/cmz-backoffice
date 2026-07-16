import { InfrastructureTypeDeleteValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-delete.validate-contract';
import { InfrastructureTypeDeleteContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-delete.contract';
import { validateInfrastructureTypeDelete } from '@presentation/pages/administrative-infrastructure/domain/validators/infrastructure-type/infrastructure-type-delete.validator';

export function infrastructureTypeDeleteVo(
    contract: InfrastructureTypeDeleteContract
): InfrastructureTypeDeleteValidateContract {
    validateInfrastructureTypeDelete(contract);
    return contract;
}
