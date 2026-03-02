import { MunicipalitiesByDepartmentIdFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id-filter.entity';
import { MunicipalitiesByDepartmentIdFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/departments/municipalities-by-department-id-filter-api.dto';

export function municipalitiesByDepartmentIdFilterMapper(
    filter: MunicipalitiesByDepartmentIdFilterEntity
): MunicipalitiesByDepartmentIdFilterApiDto {
    const params: MunicipalitiesByDepartmentIdFilterApiDto =
        {} as MunicipalitiesByDepartmentIdFilterApiDto;

    params.id = filter.uniqId;
    if (filter.search) {
        params['search'] = filter.search;
    }
    if (filter.region) {
        params['region_code'] = filter.region;
    }
    if (filter.department) {
        params['department_code'] = filter.department;
    }

    if (filter.period?.start) {
        params['start_date'] = filter.period.start;
    }
    if (filter.period?.end) {
        params['end_date'] = filter.period.end;
    }

    return params;
}
