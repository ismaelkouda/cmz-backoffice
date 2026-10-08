import { inject, Injectable } from '@angular/core';
import { MobileNetworkFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-filter-api.dto';
import { MobileNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-filter.contract';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';

@Injectable({ providedIn: 'root' })
export class MobileNetworkFilterMapper {
    private readonly apiDateMapper = inject(ApiDateMapper);

    map(validContract: MobileNetworkFilterContract): MobileNetworkFilterApiDto {
        return {
            ...(validContract.search && { search: validContract.search }),
            ...(validContract.siteGroupId && {
                site_group_id: validContract.siteGroupId,
            }),
            ...(validContract.towerTypeId && {
                tower_type_id: validContract.towerTypeId,
            }),
            ...(validContract.towerSize !== undefined && {
                tower_size: validContract.towerSize,
            }),
            ...(validContract.technology && {
                technology: validContract.technology,
            }),
            ...(validContract.operator && { operator: validContract.operator }),
            ...(validContract.radius !== undefined && {
                radius: validContract.radius,
            }),
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
