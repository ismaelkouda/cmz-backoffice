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
    if (!contract.siteGroupId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.UPDATE.SITE_GROUP_REQUIRE'
        );
    }
    if (!contract.towerTypeId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.UPDATE.TOWER_TYPE_REQUIRE'
        );
    }
    if (!contract.towerHeight) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.UPDATE.TOWER_HEIGHT_REQUIRE'
        );
    }
    if (!contract.networkTechnology) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.UPDATE.NETWORK_TECHNOLOGY_REQUIRE'
        );
    }
    if (!contract.operator) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.MOBILE_NETWORK.FORM.ERROR.UPDATE.OPERATOR_REQUIRE'
        );
    }
}
