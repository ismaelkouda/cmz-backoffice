import { MobileNetworkFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-find-one-filter.contract';
import { MobileNetworkFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-find-one-filter.validate-contract';
import { validateMobileNetworkFindOneFilter } from '@pages/coverage-areas/domain/validators/mobile-network/mobile-network-find-one-filter.validator';

export function mobileNetworkFindOneFilterVo(
    contract: MobileNetworkFindOneFilterContract
): MobileNetworkFindOneFilterValidateContract {
    validateMobileNetworkFindOneFilter(contract);
    return contract;
}
