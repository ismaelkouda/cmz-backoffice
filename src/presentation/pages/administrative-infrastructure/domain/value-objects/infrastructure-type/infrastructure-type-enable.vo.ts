import { InfrastructureTypeEnableContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-enable.contract';
import { validateInfrastructureTypeEnable } from '@presentation/pages/administrative-infrastructure/domain/validators/infrastructure-type/infrastructure-type-enable.validator';
import { InfrastructureTypeEnableValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-enable.validate-contract';

export function infrastructureTypeEnableVo(
    contract: InfrastructureTypeEnableContract
): InfrastructureTypeEnableValidateContract {
    validateInfrastructureTypeEnable(contract);
    return contract;
}
