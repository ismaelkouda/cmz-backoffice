import { RegionsFilter } from "@presentation/pages/administrative-boundary/core/domain/value-objects/regions/regions-filter.vo";
import { RegionsFilterApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/regions-filter-api.dto";


export class RegionsFilterMapper {
    static toApi(filter: RegionsFilter): RegionsFilterApiDto {
        const params: RegionsFilterApiDto = {} as RegionsFilterApiDto;

        if (filter.startDate) params['start_date'] = filter.startDate;
        if (filter.endDate) params['end_date'] = filter.endDate;
        if (filter.search) params['search'] = filter.search;
        if (filter.departmentCode) params['department_code'] = filter.departmentCode;
        if (filter.municipalityCode) params['municipality_code'] = filter.municipalityCode;
        if (filter.isActive !== undefined && filter.isActive !== null) params['is_active'] = filter.isActive;

        return params;
    }
}
