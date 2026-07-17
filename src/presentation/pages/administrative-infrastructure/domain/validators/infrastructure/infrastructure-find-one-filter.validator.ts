import { InfrastructureFindOneFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-find-one-filter.contract';
import { InfrastructureFindOneFilterValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-find-one-filter.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateInfrastructureFindOneFilter(
    contract: InfrastructureFindOneFilterContract
): asserts contract is InfrastructureFindOneFilterValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FORM.ERROR.FIND_ONE.UNIQ_ID_REQUIRE'
        );
    }
}
