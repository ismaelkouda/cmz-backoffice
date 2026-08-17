import { OpticalFiberNetworkQuery } from '@pages/coverage-areas/application/queries/optical-fiber-network/optical-fiber-network.query';
import { OpticalFiberNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-filter.contract';

export function opticalFiberNetworkQueryMapper(
    query: OpticalFiberNetworkQuery
): OpticalFiberNetworkFilterContract {
    return {
        search: query.search,
        operator: query.operator,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
