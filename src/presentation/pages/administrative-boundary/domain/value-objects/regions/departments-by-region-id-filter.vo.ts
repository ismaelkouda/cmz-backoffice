import { DepartmentsByRegionIdFilterDto } from '@pages/administrative-boundary/application/dto/regions/departments-by-region-id-filter.dto';
import { DepartmentsByRegionIdFilterProps } from '@pages/administrative-boundary/domain/interfaces/regions/departments-by-region-id-filter-props.interface';
import { validateDepartmentsByRegionIdFilter } from '@presentation/pages/administrative-boundary/domain/validators/regions/departments-by-region-id-filter.validator';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export function departmentsByRegionIdFilterVo(
    dto: DepartmentsByRegionIdFilterDto
): DepartmentsByRegionIdFilterProps {
    validateDepartmentsByRegionIdFilter(dto);

    const period = DatePeriod.createOptional(dto.startDate, dto.endDate);

    return {
        uniqId: dto.uniqId,
        search: dto.search,
        municipality: dto.municipality,
        status: dto.status,
        period,
    };
}
