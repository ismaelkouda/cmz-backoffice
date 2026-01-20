import { MunicipalitiesByDepartmentIdFilter } from "@presentation/pages/administrative-boundary/core/domain/value-objects/departments/municipalities-by-department-id-filter.vo";
import { MunicipalitiesByDepartmentIdFilterApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/municipalities-by-department-id-filter-api.dto";

export class MunicipalitiesByDepartmentIdFilterMapper {
    static toApi(filter: MunicipalitiesByDepartmentIdFilter): MunicipalitiesByDepartmentIdFilterApiDto {
        const params: MunicipalitiesByDepartmentIdFilterApiDto = {} as MunicipalitiesByDepartmentIdFilterApiDto;

        params.department_code = filter.departmentCode;
        if (filter.startDate) params['start_date'] = filter.startDate;
        if (filter.endDate) params['end_date'] = filter.endDate;
        if (filter.search) params['search'] = filter.search;
        if (filter.isActive !== undefined && filter.isActive !== null) params['is_active'] = filter.isActive;

        return params;
    }
}