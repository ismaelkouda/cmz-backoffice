import { OpticalFiberNetworkFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-filter-api.dto';
import { OpticalFiberNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-filter.contract';

export function opticalFiberNetworkFilterMapper(
    validContract: OpticalFiberNetworkFilterContract
): OpticalFiberNetworkFilterApiDto {
    const params: OpticalFiberNetworkFilterApiDto =
        {} as OpticalFiberNetworkFilterApiDto;

    if (validContract.search) {
        params.search = validContract.search;
    }
    if (validContract.operator) {
        params.operator = validContract.operator;
    }
    if (validContract.startDate) {
        params.start_date = validContract.startDate;
    }
    if (validContract.endDate) {
        params.end_date = validContract.endDate;
    }

    return params;
}
