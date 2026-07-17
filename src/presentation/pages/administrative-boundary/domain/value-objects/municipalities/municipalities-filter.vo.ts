import { MunicipalitiesFilterDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-filter.dto';
import { MunicipalitiesFilterProps } from '@pages/administrative-boundary/domain/interfaces/municipalities/municipalities-filter-props.interface';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export function municipalitiesFilterVo(
    dto: MunicipalitiesFilterDto
): MunicipalitiesFilterProps {
    const normalizedSearch = dto.search?.trim();

    const search =
        normalizedSearch && normalizedSearch.length > 0
            ? normalizedSearch
            : null;

    const period = DatePeriod.createOptional(dto.startDate, dto.endDate);

    return {
        search,
        region: dto.region,
        department: dto.department,
        period,
    };
}
