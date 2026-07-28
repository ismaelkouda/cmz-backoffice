import { OpticalFiberNetworkDisableContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-disable.contract';
import { OpticalFiberNetworkDisableValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-disable.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateOpticalFiberNetworkDisable(
    contract: OpticalFiberNetworkDisableContract
): asserts contract is OpticalFiberNetworkDisableValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.FORM.ERROR.DISABLE.UNIQ_ID_REQUIRE'
        );
    }
}
