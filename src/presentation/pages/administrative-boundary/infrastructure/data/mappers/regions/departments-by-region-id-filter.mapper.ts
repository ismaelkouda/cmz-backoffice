import { DepartmentsByRegionIdFilterEntity } from '@pages/administrative-boundary/domain/entities/regions/departments-by-region-id-filter.entity';
import { DepartmentsByRegionIdFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/departments-by-region-id-filter-api.dto';

export function DepartmentsByRegionIdFilterMapper(
    filter: DepartmentsByRegionIdFilterEntity
): DepartmentsByRegionIdFilterApiDto {
    const params: DepartmentsByRegionIdFilterApiDto =
        {} as DepartmentsByRegionIdFilterApiDto;

    params.id = filter.uniqId;
    if (filter.search) {
        params['search'] = filter.search;
    }
    if (filter.region) {
        params['region_id'] = filter.region;
    }
    if (filter.municipality) {
        params['municipality_code'] = filter.municipality;
    }

    if (filter.period?.start) {
        params['start_date'] = filter.period.start;
    }
    if (filter.period?.end) {
        params['end_date'] = filter.period.end;
    }

    return params;
}
