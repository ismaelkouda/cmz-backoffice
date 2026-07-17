import { InfrastructureTypeFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-filter.contract';
import { validateInfrastructureTypeFilter } from '@presentation/pages/administrative-infrastructure/domain/validators/infrastructure-type/infrastructure-type-filter.validator';

export function infrastructureTypeFilterVo(
    contract: InfrastructureTypeFilterContract
): InfrastructureTypeFilterContract {
    validateInfrastructureTypeFilter(contract);
    return contract;
}
