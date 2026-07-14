import { InfrastructureUpdateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-update.contract';
import { InfrastructureUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateInfrastructureUpdate(
    contract: InfrastructureUpdateContract
): asserts contract is InfrastructureUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.name) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FORM.ERROR.UPDATE.NAME_REQUIRE'
        );
    }
    if (!contract.type) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FORM.ERROR.UPDATE.TYPE_REQUIRE'
        );
    }
    if (!contract.position) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FORM.ERROR.UPDATE.POSITION_REQUIRE'
        );
    }
    if (!contract.description) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FORM.ERROR.UPDATE.DESCRIPTION_REQUIRE'
        );
    }
}
