import { InfrastructureFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-filter.contract';
import { assertValidDateRange } from '@shared/domain/validators/assert-valid-date-range.validator';

export function validateInfrastructureFilter(
    contract: InfrastructureFilterContract
): asserts contract is InfrastructureFilterContract {
    assertValidDateRange(contract?.startDate, contract?.endDate);
}
