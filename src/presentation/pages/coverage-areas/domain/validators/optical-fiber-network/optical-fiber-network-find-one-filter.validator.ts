import { OpticalFiberNetworkFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-find-one-filter.contract';
import { OpticalFiberNetworkFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-find-one-filter.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateOpticalFiberNetworkFindOneFilter(
    contract: OpticalFiberNetworkFindOneFilterContract
): asserts contract is OpticalFiberNetworkFindOneFilterValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.FORM.ERROR.FIND_ONE.UNIQ_ID_REQUIRE'
        );
    }
}
