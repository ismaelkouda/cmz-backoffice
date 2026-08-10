import { MobileNetworkCreateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-create.contract';
import { MobileNetworkCreateValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-create.validate-contract';
import { validateMobileNetworkCreate } from '@pages/coverage-areas/domain/validators/mobile-network/mobile-network-create.validator';

export function mobileNetworkCreateVo(
    contract: MobileNetworkCreateContract
): MobileNetworkCreateValidateContract {
    validateMobileNetworkCreate(contract);
    return {
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
