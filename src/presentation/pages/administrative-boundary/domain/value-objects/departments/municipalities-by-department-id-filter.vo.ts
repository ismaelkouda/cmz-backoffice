import { MunicipalitiesByDepartmentIdFilterDto } from '@pages/administrative-boundary/application/dto/departments/municipalities-by-department-id-filter.dto';
import { MunicipalitiesByDepartmentIdFilterProps } from '@pages/administrative-boundary/domain/interfaces/departments/municipalities-by-department-id-filter-props.interface';
import { validateMunicipalitiesByDepartmentIdFilter } from '@presentation/pages/administrative-boundary/domain/validators/departments/municipalities-by-department-id-filter.validator';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export function municipalitiesByDepartmentIdFilterVo(
    dto: MunicipalitiesByDepartmentIdFilterDto
): MunicipalitiesByDepartmentIdFilterProps {
    validateMunicipalitiesByDepartmentIdFilter(dto);

    const period = DatePeriod.createOptional(dto.startDate, dto.endDate);

    return {
        uniqId: dto.uniqId,
        search: dto.search,
        region: dto.region,
        department: dto.department,
        status: dto.status,
        period,
    };
}
