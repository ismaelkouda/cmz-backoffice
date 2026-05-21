import { RegionsFilterEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-filter.entity';
import { RegionsFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-filter-api.dto';

export function regionsFilterMapper(
    filter: RegionsFilterEntity
): RegionsFilterApiDto {
    const params: RegionsFilterApiDto = {} as RegionsFilterApiDto;
    if (filter.search) {
        params['search'] = filter.search;
    }
    if (filter.period?.start) {
        params['start_date'] = filter.period.start;
    }
    if (filter.period?.end) {
        params['end_date'] = filter.period.end;
    }

    return params;
}
