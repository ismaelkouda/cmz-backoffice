import { MobileNetworkFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-filter-api.dto';
import { MobileNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-filter.contract';

export function mobileNetworkFilterMapper(
    validContract: MobileNetworkFilterContract
): MobileNetworkFilterApiDto {
    const params: MobileNetworkFilterApiDto = {} as MobileNetworkFilterApiDto;

    if (validContract.search) {
        params.search = validContract.search;
    }
    if (validContract.towerTypeId) {
        params.tower_type_id = validContract.towerTypeId;
    }
    if (validContract.towerSize !== undefined) {
        params.tower_size = validContract.towerSize;
    }
    if (validContract.technology) {
        params.technology = validContract.technology;
    }
    if (validContract.operator) {
        params.operator = validContract.operator;
    }
    if (validContract.radius !== undefined) {
        params.radius = validContract.radius;
    }
    if (validContract.startDate) {
        params.start_date = validContract.startDate;
    }
    if (validContract.endDate) {
        params.end_date = validContract.endDate;
    }

    return params;
}
