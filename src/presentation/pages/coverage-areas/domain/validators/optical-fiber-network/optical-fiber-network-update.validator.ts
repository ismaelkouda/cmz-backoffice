import { OpticalFiberNetworkUpdateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-update.contract';
import { OpticalFiberNetworkUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateOpticalFiberNetworkUpdate(
    contract: OpticalFiberNetworkUpdateContract
): asserts contract is OpticalFiberNetworkUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.name) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.FORM.ERROR.UPDATE.NAME_REQUIRE'
        );
    }
    if (!contract.operator) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.FORM.ERROR.UPDATE.OPERATOR_REQUIRE'
        );
    }
    if (!contract.fiberConstructorId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.FORM.ERROR.UPDATE.FIBER_CONSTRUCTOR_REQUIRE'
        );
    }
    if (!contract.type) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.FORM.ERROR.UPDATE.TYPE_REQUIRE'
        );
    }
}
