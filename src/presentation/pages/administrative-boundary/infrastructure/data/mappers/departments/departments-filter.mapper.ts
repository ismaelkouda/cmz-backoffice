import { DepartmentsFilterEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-filter.entity';
import { DepartmentsFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-filter-api.dto';

export function departmentsFilterMapper(
    filter: DepartmentsFilterEntity
): DepartmentsFilterApiDto {
    const params: DepartmentsFilterApiDto = {} as DepartmentsFilterApiDto;
    if (filter.search) {
        params['search'] = filter.search;
    }
    if (filter.region) {
        params['region_id'] = filter.region;
    }
    if (filter.period?.start) {
        params['start_date'] = filter.period.start;
    }
    if (filter.period?.end) {
        params['end_date'] = filter.period.end;
    }

    return params;
}
