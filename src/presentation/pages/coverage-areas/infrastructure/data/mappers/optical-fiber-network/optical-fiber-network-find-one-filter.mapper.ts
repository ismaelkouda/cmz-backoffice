import { OpticalFiberNetworkFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-find-one-filter.validate-contract';
import { OpticalFiberNetworkFindOneFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-find-one-filter-api.dto';

export function opticalFiberNetworkFindOneFilterMapper(
    validContract: OpticalFiberNetworkFindOneFilterValidateContract
): OpticalFiberNetworkFindOneFilterApiDto {
    return {
        id: validContract.uniqId,
    };
}
