import { MobileNetworkDeleteContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-delete.contract';
import { MobileNetworkDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-delete.validate-contract';
import { validateMobileNetworkDelete } from '@pages/coverage-areas/domain/validators/mobile-network/mobile-network-delete.validator';

export function mobileNetworkDeleteVo(
    contract: MobileNetworkDeleteContract
): MobileNetworkDeleteValidateContract {
    validateMobileNetworkDelete(contract);
    return contract;
}
