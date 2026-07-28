import { OpticalFiberNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-filter.contract';
import { validateOpticalFiberNetworkFilter } from '@pages/coverage-areas/domain/validators/optical-fiber-network/optical-fiber-network-filter.validator';

export function opticalFiberNetworkFilterVo(
    contract: OpticalFiberNetworkFilterContract
): OpticalFiberNetworkFilterContract {
    validateOpticalFiberNetworkFilter(contract);
    return contract;
}
