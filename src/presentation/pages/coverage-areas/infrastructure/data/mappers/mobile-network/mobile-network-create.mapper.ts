import { MobileNetworkCreateValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-create.validate-contract';
import { MobileNetworkCreateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-create-api.dto';

export function mobileNetworkCreateMapper(
    validContract: MobileNetworkCreateValidateContract
): MobileNetworkCreateApiDto {
    const params: MobileNetworkCreateApiDto = {} as MobileNetworkCreateApiDto;

    if (validContract.siteId) {
        params.site_id = validContract.siteId;
    }
    if (validContract.siteName) {
        params.site_name = validContract.siteName;
    }
    if (validContract.infrastructureType) {
        params.infrastructure_type = validContract.infrastructureType;
    }
    if (validContract.towerTypeId) {
        params.tower_type_id = validContract.towerTypeId;
    }
    if (validContract.towerSize !== undefined) {
        params.tower_size = validContract.towerSize;
    }
    if (validContract.technology?.length) {
        params.technology = validContract.technology;
    }
    if (validContract.operator) {
        params.operator = validContract.operator;
    }
    if (validContract.radius !== undefined) {
        params.radius = validContract.radius;
    }

    return params;
}
