import { MunicipalitiesFilterEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-filter.entity';
import { MunicipalitiesFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-filter-api.dto';
import { StatusMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-status.mapper';

export function municipalitiesFilterMapper(
    filter: MunicipalitiesFilterEntity
): MunicipalitiesFilterApiDto {
    const params: MunicipalitiesFilterApiDto = {} as MunicipalitiesFilterApiDto;
    if (filter.search) {
        params['search'] = filter.search;
    }
    if (filter.region) {
        params['region_code'] = filter.region;
    }
    if (filter.department) {
        params['department_code'] = filter.department;
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
