import { DepartmentsByRegionIdFilter } from "@presentation/pages/administrative-boundary/core/domain/value-objects/regions/departments-by-region-id-filter.vo";
import { DepartmentsByRegionIdFilterApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/departments-by-region-id-filter-api.dto";


export class DepartmentsByRegionIdFilterMapper {
    static toApi(filter: DepartmentsByRegionIdFilter): DepartmentsByRegionIdFilterApiDto {
        const params: DepartmentsByRegionIdFilterApiDto = {} as DepartmentsByRegionIdFilterApiDto;

        params.region_code = filter.regionCode;
        if (filter.startDate) params['start_date'] = filter.startDate;
        if (filter.endDate) params['end_date'] = filter.endDate;
        if (filter.search) params['search'] = filter.search;
        if (filter.municipalityCode) params['municipality_code'] = filter.municipalityCode;
        if (filter.isActive !== undefined && filter.isActive !== null) params['is_active'] = filter.isActive;

        return params;
    }
}
