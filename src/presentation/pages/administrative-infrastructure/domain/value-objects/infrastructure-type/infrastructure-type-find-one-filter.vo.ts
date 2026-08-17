import { InfrastructureTypeFindOneFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-find-one-filter.contract';
import { validateInfrastructureTypeFindOneFilter } from '@presentation/pages/administrative-infrastructure/domain/validators/infrastructure-type/infrastructure-type-find-one-filter.validator';
import { InfrastructureTypeFindOneFilterValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-find-one-filter.validate-contract';

export function infrastructureTypeFindOneFilterVo(
    contract: InfrastructureTypeFindOneFilterContract
): InfrastructureTypeFindOneFilterValidateContract {
    validateInfrastructureTypeFindOneFilter(contract);
    return contract;
}
