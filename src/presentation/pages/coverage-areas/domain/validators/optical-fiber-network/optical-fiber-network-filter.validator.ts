import { OpticalFiberNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-filter.contract';
import { assertValidDateRange } from '@shared/domain/validators/assert-valid-date-range.validator';

export function validateOpticalFiberNetworkFilter(
    contract: OpticalFiberNetworkFilterContract
): asserts contract is OpticalFiberNetworkFilterContract {
    assertValidDateRange(contract?.startDate, contract?.endDate);
}
