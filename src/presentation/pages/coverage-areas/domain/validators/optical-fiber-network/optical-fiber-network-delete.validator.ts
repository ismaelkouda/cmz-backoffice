import { OpticalFiberNetworkDeleteContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-delete.contract';
import { OpticalFiberNetworkDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-delete.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateOpticalFiberNetworkDelete(
    contract: OpticalFiberNetworkDeleteContract
): asserts contract is OpticalFiberNetworkDeleteValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.FORM.ERROR.DELETE.UNIQ_ID_REQUIRE'
        );
    }
}
