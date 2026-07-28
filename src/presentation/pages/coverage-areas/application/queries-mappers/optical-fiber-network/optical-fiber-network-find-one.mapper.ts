import { OpticalFiberNetworkFindOneQuery } from '@pages/coverage-areas/application/queries/optical-fiber-network/optical-fiber-network-find-one.query';
import { OpticalFiberNetworkFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-find-one-filter.contract';

export function opticalFiberNetworkFindOneQueryMapper(
    query: OpticalFiberNetworkFindOneQuery
): OpticalFiberNetworkFindOneFilterContract {
    return {
        uniqId: query.uniqId,
    };
}
