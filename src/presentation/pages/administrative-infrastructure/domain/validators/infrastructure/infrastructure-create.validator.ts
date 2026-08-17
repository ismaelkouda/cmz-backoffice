import { InfrastructureCreateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-create.contract';
import { InfrastructureCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateInfrastructureCreate(
    contract: InfrastructureCreateContract
): asserts contract is InfrastructureCreateValidateContract {
    if (!contract.name) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FORM.ERROR.CREATE.NAME_REQUIRE'
        );
    }
    if (!contract.type) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FORM.ERROR.CREATE.TYPE_REQUIRE'
        );
    }
    if (!contract.position) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FORM.ERROR.CREATE.POSITION_REQUIRE'
        );
    }
    if (!contract.description) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FORM.ERROR.CREATE.DESCRIPTION_REQUIRE'
        );
    }
}
