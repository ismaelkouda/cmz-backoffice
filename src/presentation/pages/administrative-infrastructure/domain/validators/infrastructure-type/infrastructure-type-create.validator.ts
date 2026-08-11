import { InfrastructureTypeCreateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-create.contract';
import { InfrastructureTypeCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateInfrastructureTypeCreate(
    contract: InfrastructureTypeCreateContract
): asserts contract is InfrastructureTypeCreateValidateContract {
    if (!contract.name) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.ERROR.CREATE.NAME_REQUIRE'
        );
    }
    if (!contract.description) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.ERROR.CREATE.DESCRIPTION_REQUIRE'
        );
    }
    if (!contract.tag) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.ERROR.CREATE.TAG_REQUIRE'
        );
    }
}
