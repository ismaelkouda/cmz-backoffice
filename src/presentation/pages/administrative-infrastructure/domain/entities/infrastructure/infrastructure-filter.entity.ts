import { InfrastructureFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-filter.contract';
import { resolveOpenEndedEndDate } from '@shared/domain/utils/resolve-open-ended-end-date.util';

export function infrastructureFilterEntity(
    contract: InfrastructureFilterContract
): InfrastructureFilterContract {
    return {
        ...contract,
        endDate: resolveOpenEndedEndDate(contract.startDate, contract.endDate),
    };
}
