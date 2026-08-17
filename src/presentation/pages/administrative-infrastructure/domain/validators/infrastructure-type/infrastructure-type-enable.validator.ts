import { InfrastructureTypeEnableContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-enable.contract';
import { InfrastructureTypeEnableValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-enable.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateInfrastructureTypeEnable(
    contract: InfrastructureTypeEnableContract
): asserts contract is InfrastructureTypeEnableValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.ERROR.ENABLE.UNIQ_ID_REQUIRE'
        );
    }
}
