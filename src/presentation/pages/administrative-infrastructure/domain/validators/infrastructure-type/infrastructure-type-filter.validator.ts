import { InfrastructureTypeFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-filter.contract';
import { assertValidDateRange } from '@shared/domain/validators/assert-valid-date-range.validator';

export function validateInfrastructureTypeFilter(
    contract: InfrastructureTypeFilterContract
): asserts contract is InfrastructureTypeFilterContract {
    assertValidDateRange(contract?.startDate, contract?.endDate);
}
