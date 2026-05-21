import { MunicipalitiesFilterDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-filter.dto';
import { MunicipalitiesFilterProps } from '@pages/administrative-boundary/domain/interfaces/municipalities/municipalities-filter-props.interface';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class MunicipalitiesFilterVo {
    constructor(private readonly props: MunicipalitiesFilterProps) {}

    get search(): string | null {
        return this.props.search;
    }
    get region(): string | null {
        return this.props.region;
    }
    get department(): string | null {
        return this.props.department;
    }
    get period(): DatePeriod | null {
        return this.props.period;
    }

    static fromDto(dto: MunicipalitiesFilterDto): MunicipalitiesFilterVo {
        const normalizedSearch = dto.search?.trim();

        const search =
            normalizedSearch && normalizedSearch.length > 0
                ? normalizedSearch
                : null;

        const period =
            dto.startDate || dto.endDate
                ? DatePeriod.create(dto.startDate, dto.endDate)
                : null;

        return new MunicipalitiesFilterVo({
            search,
            region: dto.region,
            department: dto.department,
            period,
        });
    }
}
