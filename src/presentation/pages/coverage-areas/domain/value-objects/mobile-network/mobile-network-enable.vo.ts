import { MobileNetworkEnableContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-enable.contract';
import { MobileNetworkEnableValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-enable.validate-contract';
import { validateMobileNetworkEnable } from '@pages/coverage-areas/domain/validators/mobile-network/mobile-network-enable.validator';

export function mobileNetworkEnableVo(
    contract: MobileNetworkEnableContract
): MobileNetworkEnableValidateContract {
    validateMobileNetworkEnable(contract);
    return contract;
}
