import { MobileNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-filter.contract';
import { validateMobileNetworkFilter } from '@pages/coverage-areas/domain/validators/mobile-network/mobile-network-filter.validator';

export function mobileNetworkFilterVo(
    contract: MobileNetworkFilterContract
): MobileNetworkFilterContract {
    validateMobileNetworkFilter(contract);
    return contract;
}
