import { RegionsFilterDto } from '@pages/administrative-boundary/application/dto/regions/regions-filter.dto';
import { RegionsFilterProps } from '@pages/administrative-boundary/domain/interfaces/regions/regions-filter-props.interface';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class RegionsFilterVo {
    constructor(private readonly props: RegionsFilterProps) {}

    get search(): string | null {
        return this.props.search;
    }

    get period(): DatePeriod | null {
        return this.props.period;
    }

    static fromDto(dto: RegionsFilterDto): RegionsFilterVo {
        const normalizedSearch = dto.search?.trim();

        const search =
            normalizedSearch && normalizedSearch.length > 0
                ? normalizedSearch
                : null;

        const period =
            dto.startDate || dto.endDate
                ? DatePeriod.create(dto.startDate, dto.endDate)
                : null;

        return new RegionsFilterVo({
            search,
            period,
        });
    }
}
