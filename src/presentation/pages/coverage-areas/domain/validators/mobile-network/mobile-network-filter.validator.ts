import { MobileNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-filter.contract';
import { assertValidDateRange } from '@shared/domain/validators/assert-valid-date-range.validator';

export function validateMobileNetworkFilter(
    contract: MobileNetworkFilterContract
): asserts contract is MobileNetworkFilterContract {
    assertValidDateRange(contract?.startDate, contract?.endDate);
}
