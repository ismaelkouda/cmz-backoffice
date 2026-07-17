import { MobileNetworkUpdateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-update.contract';
import { MobileNetworkUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateMobileNetworkUpdate(
    contract: MobileNetworkUpdateContract
): asserts contract is MobileNetworkUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.siteId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.UPDATE.SITE_ID_REQUIRE'
        );
    }
    if (!contract.siteName) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.UPDATE.SITE_NAME_REQUIRE'
        );
    }
    if (!contract.towerTypeId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.UPDATE.TOWER_TYPE_REQUIRE'
        );
    }
    if (contract.towerSize === undefined || contract.towerSize === null) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.UPDATE.TOWER_SIZE_REQUIRE'
        );
    }
    if (!contract.technology) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.UPDATE.TECHNOLOGY_REQUIRE'
        );
    }
    if (!contract.operator) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.UPDATE.OPERATOR_REQUIRE'
        );
    }
}
