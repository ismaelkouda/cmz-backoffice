import { inject, Injectable } from '@angular/core';
import { SiteGroupFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-filter-api.dto';
import { SiteGroupFilterContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-filter.contract';
import { Status } from '@pages/coverage-areas/domain/enums/site-group/site-group-status.enum';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';

@Injectable({ providedIn: 'root' })
export class SiteGroupFilterMapper {
    private readonly apiDateMapper = inject(ApiDateMapper);

    map(validContract: SiteGroupFilterContract): SiteGroupFilterApiDto {
        return {
            ...(validContract.search && { search: validContract.search }),
            ...(validContract.status !== undefined && {
                is_active: validContract.status === Status.ACTIVE,
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
