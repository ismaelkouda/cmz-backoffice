import { RegionsFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-filter.entity';
import { RegionsFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/regions/regions-filter-api.dto';
import { StatusMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/regions-status.mapper';

export function regionsFilterMapper(
    filter: RegionsFilterEntity
): RegionsFilterApiDto {
    const params: RegionsFilterApiDto = {} as RegionsFilterApiDto;
    if (filter.search) {
        params['search'] = filter.search;
    }
    if (filter.department) {
        params['department_code'] = filter.department;
    }
    if (filter.municipality) {
        params['municipality_code'] = filter.municipality;
    }
    if (filter.status) {
        params['is_active'] = new StatusMapper().mapStatusToApi(filter.status);
    }

    if (filter.period?.start) {
        params['start_date'] = filter.period.start;
    }
    if (filter.period?.end) {
        params['end_date'] = filter.period.end;
    }

    return params;
}
