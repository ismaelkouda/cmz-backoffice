import { MunicipalitiesFilterEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-filter.entity';
import { MunicipalitiesFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-filter-api.dto';

export function municipalitiesFilterMapper(
    filter: MunicipalitiesFilterEntity
): MunicipalitiesFilterApiDto {
    const params: MunicipalitiesFilterApiDto = {} as MunicipalitiesFilterApiDto;
    if (filter.search) {
        params['search'] = filter.search;
    }
    if (filter.region) {
        params['region_id'] = filter.region;
    }
    if (filter.department) {
        params['department_id'] = filter.department;
    }
    if (filter.period?.start) {
        params['start_date'] = filter.period.start;
    }
    if (filter.period?.end) {
        params['end_date'] = filter.period.end;
    }

    return params;
}
