import { InfrastructureTypeDisableContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-disable.contract';
import { validateInfrastructureTypeDisable } from '@presentation/pages/administrative-infrastructure/domain/validators/infrastructure-type/infrastructure-type-disable.validator';
import { InfrastructureTypeDisableValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-disable.validate-contract';

export function infrastructureTypeDisableVo(
    contract: InfrastructureTypeDisableContract
): InfrastructureTypeDisableValidateContract {
    validateInfrastructureTypeDisable(contract);
    return contract;
}
