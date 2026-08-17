import { InfrastructureDeleteContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-delete.contract';
import { InfrastructureDeleteValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-delete.validate-contract';
import { validateInfrastructureDelete } from '@presentation/pages/administrative-infrastructure/domain/validators/infrastructure/infrastructure-delete.validator';

export function infrastructureDeleteVo(
    contract: InfrastructureDeleteContract
): InfrastructureDeleteValidateContract {
    validateInfrastructureDelete(contract);
    return contract;
}
