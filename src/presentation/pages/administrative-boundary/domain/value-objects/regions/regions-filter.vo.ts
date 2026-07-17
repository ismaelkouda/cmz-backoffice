import { RegionsFilterDto } from '@pages/administrative-boundary/application/dto/regions/regions-filter.dto';
import { RegionsFilterProps } from '@pages/administrative-boundary/domain/interfaces/regions/regions-filter-props.interface';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export function regionsFilterVo(dto: RegionsFilterDto): RegionsFilterProps {
    const normalizedSearch = dto.search?.trim();

    const search =
        normalizedSearch && normalizedSearch.length > 0
            ? normalizedSearch
            : null;

    const period = DatePeriod.createOptional(dto.startDate, dto.endDate);

    return {
        search,
        period,
    };
}
