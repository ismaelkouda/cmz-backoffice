import { InfrastructureTypeFindOneFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-find-one-filter.contract';
import { InfrastructureTypeFindOneFilterValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-find-one-filter.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateInfrastructureTypeFindOneFilter(
    contract: InfrastructureTypeFindOneFilterContract
): asserts contract is InfrastructureTypeFindOneFilterValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.ERROR.FIND_ONE.UNIQ_ID_REQUIRE'
        );
    }
}
