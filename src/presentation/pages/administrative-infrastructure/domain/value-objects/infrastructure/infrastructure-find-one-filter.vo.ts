import { InfrastructureFindOneFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-find-one-filter.contract';
import { InfrastructureFindOneFilterValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-find-one-filter.validate-contract';
import { validateInfrastructureFindOneFilter } from '@presentation/pages/administrative-infrastructure/domain/validators/infrastructure/infrastructure-find-one-filter.validator';

export function infrastructureFindOneFilterVo(
    contract: InfrastructureFindOneFilterContract
): InfrastructureFindOneFilterValidateContract {
    validateInfrastructureFindOneFilter(contract);
    return contract;
}
