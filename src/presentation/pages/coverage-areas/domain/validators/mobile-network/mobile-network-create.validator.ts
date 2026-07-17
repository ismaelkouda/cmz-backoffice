import { MobileNetworkCreateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-create.contract';
import { MobileNetworkCreateValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateMobileNetworkCreate(
    contract: MobileNetworkCreateContract
): asserts contract is MobileNetworkCreateValidateContract {
    if (!contract.siteId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.CREATE.SITE_ID_REQUIRE'
        );
    }
    if (!contract.siteName) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.CREATE.SITE_NAME_REQUIRE'
        );
    }
    if (!contract.towerTypeId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.CREATE.TOWER_TYPE_REQUIRE'
        );
    }
    if (contract.towerSize === undefined || contract.towerSize === null) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.CREATE.TOWER_SIZE_REQUIRE'
        );
    }
    if (!contract.technology) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.CREATE.TECHNOLOGY_REQUIRE'
        );
    }
    if (!contract.operator) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.CREATE.OPERATOR_REQUIRE'
        );
    }
}
