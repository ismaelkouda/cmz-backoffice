import { MunicipalitiesFilter } from "@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-filter.vo";
import { MunicipalitiesFilterApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/municipalities/municipalities-filter-api.dto";


export class MunicipalitiesFilterMapper {
    static toApi(filter: MunicipalitiesFilter): MunicipalitiesFilterApiDto {
        const params: MunicipalitiesFilterApiDto = {} as MunicipalitiesFilterApiDto;

        if (filter.startDate) params['start_date'] = filter.startDate;
        if (filter.endDate) params['end_date'] = filter.endDate;
        if (filter.search) params['search'] = filter.search;
        if (filter.regionCode) params['region_code'] = filter.regionCode;
        if (filter.departmentCode) params['department_code'] = filter.departmentCode;
        if (filter.isActive !== undefined && filter.isActive !== null) params['is_active'] = filter.isActive;

        return params;
    }
}
