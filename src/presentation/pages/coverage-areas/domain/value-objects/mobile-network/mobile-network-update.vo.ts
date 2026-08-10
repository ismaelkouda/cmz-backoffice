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
        siteGroupId: contract.siteGroupId,
        towerTypeId: contract.towerTypeId,
        towerHeight: contract.towerHeight,
        networkTechnology: contract.networkTechnology,
        operator: contract.operator,
        coverageRadius: contract.coverageRadius,
    };
}
