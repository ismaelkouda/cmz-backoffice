import { MobileNetworkDeleteContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-delete.contract';
import { MobileNetworkDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-delete.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateMobileNetworkDelete(
    contract: MobileNetworkDeleteContract
): asserts contract is MobileNetworkDeleteValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.DELETE.UNIQ_ID_REQUIRE'
        );
    }
}
