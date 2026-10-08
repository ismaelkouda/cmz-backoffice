import { inject, Injectable } from '@angular/core';
import { OpticalFiberNetworkFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-filter-api.dto';
import { OpticalFiberNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-filter.contract';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkFilterMapper {
    private readonly apiDateMapper = inject(ApiDateMapper);

    map(
        validContract: OpticalFiberNetworkFilterContract
    ): OpticalFiberNetworkFilterApiDto {
        return {
            ...(validContract.search && { search: validContract.search }),
            ...(validContract.operator && { operator: validContract.operator }),
            ...(validContract.startDate && {
                start_date: this.apiDateMapper.toDateApi(
                    validContract.startDate
                ),
            }),
            ...(validContract.endDate && {
                end_date: this.apiDateMapper.toDateApi(validContract.endDate),
            }),
        };
    }
}
