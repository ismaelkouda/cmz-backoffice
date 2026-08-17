import { MunicipalitiesByDepartmentIdFilterProps } from '@pages/administrative-boundary/domain/interfaces/departments/municipalities-by-department-id-filter-props.interface';
import { MunicipalitiesByDepartmentIdFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/municipalities-by-department-id-filter-api.dto';

export function municipalitiesByDepartmentIdFilterMapper(
    filter: MunicipalitiesByDepartmentIdFilterProps
): MunicipalitiesByDepartmentIdFilterApiDto {
    const params: MunicipalitiesByDepartmentIdFilterApiDto =
        {} as MunicipalitiesByDepartmentIdFilterApiDto;

    params.department_id = filter.uniqId;
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
