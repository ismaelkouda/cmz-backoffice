import { MobileNetworkDisableContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-disable.contract';
import { MobileNetworkDisableValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-disable.validate-contract';
import { validateMobileNetworkDisable } from '@pages/coverage-areas/domain/validators/mobile-network/mobile-network-disable.validator';

export function mobileNetworkDisableVo(
    contract: MobileNetworkDisableContract
): MobileNetworkDisableValidateContract {
    validateMobileNetworkDisable(contract);
    return contract;
}
