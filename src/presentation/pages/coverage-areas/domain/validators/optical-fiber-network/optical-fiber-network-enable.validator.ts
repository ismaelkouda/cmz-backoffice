import { OpticalFiberNetworkEnableContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-enable.contract';
import { OpticalFiberNetworkEnableValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-enable.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateOpticalFiberNetworkEnable(
    contract: OpticalFiberNetworkEnableContract
): asserts contract is OpticalFiberNetworkEnableValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.FORM.ERROR.ENABLE.UNIQ_ID_REQUIRE'
        );
    }
}
