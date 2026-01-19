import { DepartmentsFilter } from "@presentation/pages/administrative-boundary/core/domain/value-objects/departments/departments-filter.vo";
import { DepartmentsFilterApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/departments-filter-api.dto";


export class DepartmentsFilterMapper {
    static toApi(filter: DepartmentsFilter): DepartmentsFilterApiDto {
        const params: DepartmentsFilterApiDto = {} as DepartmentsFilterApiDto;

        if (filter.startDate) params['start_date'] = filter.startDate;
        if (filter.endDate) params['end_date'] = filter.endDate;
        if (filter.search) params['search'] = filter.search;
        if (filter.regionCode) params['region_code'] = filter.regionCode;
        if (filter.municipalityId) params['municipality_id'] = filter.municipalityId;
        if (filter.isActive !== undefined && filter.isActive !== null) params['is_active'] = filter.isActive;

        return params;
    }
}
