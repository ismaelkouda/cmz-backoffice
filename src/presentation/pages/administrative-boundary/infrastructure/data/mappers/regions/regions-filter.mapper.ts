import { RegionsFilterProps } from '@pages/administrative-boundary/domain/interfaces/regions/regions-filter-props.interface';
import { RegionsFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-filter-api.dto';

export function regionsFilterMapper(
    filter: RegionsFilterProps
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
