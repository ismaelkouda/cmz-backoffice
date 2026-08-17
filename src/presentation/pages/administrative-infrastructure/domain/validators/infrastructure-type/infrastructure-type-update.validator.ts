import { InfrastructureTypeUpdateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-update.contract';
import { InfrastructureTypeUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateInfrastructureTypeUpdate(
    contract: InfrastructureTypeUpdateContract
): asserts contract is InfrastructureTypeUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.name) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.ERROR.UPDATE.NAME_REQUIRE'
        );
    }
    if (!contract.description) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.ERROR.UPDATE.DESCRIPTION_REQUIRE'
        );
    }
    if (!contract.tag) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.ERROR.UPDATE.TAG_REQUIRE'
        );
    }
}
