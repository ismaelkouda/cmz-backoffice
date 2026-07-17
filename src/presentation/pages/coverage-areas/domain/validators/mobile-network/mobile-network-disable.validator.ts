import { MobileNetworkDisableContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-disable.contract';
import { MobileNetworkDisableValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-disable.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateMobileNetworkDisable(
    contract: MobileNetworkDisableContract
): asserts contract is MobileNetworkDisableValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.DISABLE.UNIQ_ID_REQUIRE'
        );
    }
}
