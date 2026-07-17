import { MobileNetworkQuery } from '@pages/coverage-areas/application/queries/mobile-network/mobile-network.query';
import { MobileNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-filter.contract';

export function mobileNetworkQueryMapper(
    query: MobileNetworkQuery
): MobileNetworkFilterContract {
    return {
        search: query.search,
        towerTypeId: query.towerTypeId,
        towerSize: query.towerSize,
        technology: query.technology,
        operator: query.operator,
        radius: query.radius,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
