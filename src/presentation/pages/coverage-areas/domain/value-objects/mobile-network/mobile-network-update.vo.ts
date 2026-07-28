import { MobileNetworkUpdateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-update.contract';
import { MobileNetworkUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-update.validate-contract';
import { validateMobileNetworkUpdate } from '@pages/coverage-areas/domain/validators/mobile-network/mobile-network-update.validator';

export function mobileNetworkUpdateVo(
    contract: MobileNetworkUpdateContract
): MobileNetworkUpdateValidateContract {
    validateMobileNetworkUpdate(contract);
    return {
        uniqId: contract.uniqId,
        siteId: contract.siteId,
        siteName: contract.siteName,

        infrastructureType: contract.infrastructureType,
        towerTypeId: contract.towerTypeId,
        towerSize: contract.towerSize,
        technology: contract.technology,
        operator: contract.operator,
        radius: contract.radius,
    };
}
