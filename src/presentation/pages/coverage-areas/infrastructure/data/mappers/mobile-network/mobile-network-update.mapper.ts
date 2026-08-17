import { MobileNetworkUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-update.validate-contract';
import { MobileNetworkUpdateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-update-api.dto';

export function mobileNetworkUpdateMapper(
    validContract: MobileNetworkUpdateValidateContract
): MobileNetworkUpdateApiDto {
    const params: MobileNetworkUpdateApiDto = {} as MobileNetworkUpdateApiDto;

    if (validContract.uniqId) {
        params.id = validContract.uniqId;
    }
    if (validContract.siteId) {
        params.site_id = validContract.siteId;
    }
    if (validContract.siteName) {
        params.site_name = validContract.siteName;
    }
    if (validContract.siteGroupId) {
        params.site_group_id = validContract.siteGroupId;
    }
    if (validContract.towerTypeId) {
        params.tower_type_id = validContract.towerTypeId;
    }
    if (validContract.towerHeight) {
        params.tower_height = validContract.towerHeight;
    }
    if (validContract.networkTechnology) {
        params.network_technology = validContract.networkTechnology;
    }
    if (validContract.operator) {
        params.operator = validContract.operator;
    }
    if (validContract.coverageRadius !== undefined) {
        params.coverage_radius = validContract.coverageRadius;
    }

    return params;
}
