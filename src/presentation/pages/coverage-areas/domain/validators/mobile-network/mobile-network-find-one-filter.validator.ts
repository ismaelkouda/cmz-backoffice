import { MobileNetworkFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-find-one-filter.contract';
import { MobileNetworkFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-find-one-filter.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateMobileNetworkFindOneFilter(
    contract: MobileNetworkFindOneFilterContract
): asserts contract is MobileNetworkFindOneFilterValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.FIND_ONE.UNIQ_ID_REQUIRE'
        );
    }
}
