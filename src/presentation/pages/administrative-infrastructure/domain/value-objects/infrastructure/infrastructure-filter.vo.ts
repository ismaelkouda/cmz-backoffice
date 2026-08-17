import { InfrastructureFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-filter.contract';
import { validateInfrastructureFilter } from '@presentation/pages/administrative-infrastructure/domain/validators/infrastructure/infrastructure-filter.validator';

export function infrastructureFilterVo(
    contract: InfrastructureFilterContract
): InfrastructureFilterContract {
    validateInfrastructureFilter(contract);
    return contract;
}
