import { MobileNetworkFindOneQuery } from '@pages/coverage-areas/application/queries/mobile-network/mobile-network-find-one.query';
import { MobileNetworkFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-find-one-filter.contract';

export function mobileNetworkFindOneQueryMapper(
    query: MobileNetworkFindOneQuery
): MobileNetworkFindOneFilterContract {
    return {
        uniqId: query.uniqId,
    };
}
