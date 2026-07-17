import { MobileNetworkEnableContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-enable.contract';
import { MobileNetworkEnableValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-enable.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateMobileNetworkEnable(
    contract: MobileNetworkEnableContract
): asserts contract is MobileNetworkEnableValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.ENABLE.UNIQ_ID_REQUIRE'
        );
    }
}
