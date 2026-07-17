import { DepartmentsFilterProps } from '@pages/administrative-boundary/domain/interfaces/departments/departments-filter-props.interface';
import { DepartmentsFilterDto } from '@presentation/pages/administrative-boundary/application/dto/departments/departments-filter.dto';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export function departmentsFilterVo(
    dto: DepartmentsFilterDto
): DepartmentsFilterProps {
    const normalizedSearch = dto.search?.trim();

    const search =
        normalizedSearch && normalizedSearch.length > 0
            ? normalizedSearch
            : null;

    const period = DatePeriod.createOptional(dto.startDate, dto.endDate);

    return {
        search,
        region: dto.region,
        period,
    };
}
