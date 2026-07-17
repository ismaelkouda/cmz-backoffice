import { InfrastructureTypeDeleteContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-delete.contract';
import { InfrastructureTypeDeleteValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-delete.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateInfrastructureTypeDelete(
    contract: InfrastructureTypeDeleteContract
): asserts contract is InfrastructureTypeDeleteValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.ERROR.DELETE.UNIQ_ID_REQUIRE'
        );
    }
}
