import { DepartmentsFilterProps } from '@pages/administrative-boundary/domain/interfaces/departments/departments-filter-props.interface';
import { DepartmentsFilterDto } from '@presentation/pages/administrative-boundary/application/dto/departments/departments-filter.dto';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class DepartmentsFilterVo {
    constructor(private readonly props: DepartmentsFilterProps) {}

    get search(): string | null {
        return this.props.search;
    }
    get region(): string | null {
        return this.props.region;
    }
    get period(): DatePeriod | null {
        return this.props.period;
    }

    static fromDto(dto: DepartmentsFilterDto): DepartmentsFilterVo {
        const normalizedSearch = dto.search?.trim();

        const search =
            normalizedSearch && normalizedSearch.length > 0
                ? normalizedSearch
                : null;

        const period =
            dto.startDate || dto.endDate
                ? DatePeriod.create(dto.startDate, dto.endDate)
                : null;

        return new DepartmentsFilterVo({
            search,
            region: dto.region,
            period,
        });
    }
}
