import { OpticalFiberNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-filter.contract';
import { resolveOpenEndedEndDate } from '@shared/domain/utils/resolve-open-ended-end-date.util';

export function opticalFiberNetworkFilterEntity(
    contract: OpticalFiberNetworkFilterContract
): OpticalFiberNetworkFilterContract {
    return {
        ...contract,
        endDate: resolveOpenEndedEndDate(contract.startDate, contract.endDate),
    };
}
