import { MunicipalitiesFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-filter.vo';
import { MunicipalitiesFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/municipalities/municipalities-filter-api.dto';

export function municipalitiesFilterMapper(
    filter: MunicipalitiesFilter
): MunicipalitiesFilterApiDto {
    const params: MunicipalitiesFilterApiDto = {} as MunicipalitiesFilterApiDto;

    if (filter.startDate) {
        params['start_date'] = filter.startDate;
    }
    if (filter.endDate) {
        params['end_date'] = filter.endDate;
    }
    if (filter.search) {
        params['search'] = filter.search;
    }
    if (filter. regionId) {
        params['region_code'] = filter. regionId;
    }
    if (filter.departmentId) {
        params['department_code'] = filter.departmentId;
    }
    if (filter.isActive !== undefined && filter.isActive !== null) {
        params['is_active'] = filter.isActive;
    }

    return params;
}
