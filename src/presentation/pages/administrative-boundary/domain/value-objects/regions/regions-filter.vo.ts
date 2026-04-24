import { RegionsFilterDto } from '@pages/administrative-boundary/application/dto/regions/regions-filter.dto';
import { Status } from '@pages/administrative-boundary/domain/enums/regions/regions-status.enum';
import { RegionsFilterProps } from '@pages/administrative-boundary/domain/interfaces/regions/regions-filter-props.interface';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class RegionsFilterVo {
    constructor(private readonly props: RegionsFilterProps) {}

    get search(): string | undefined {
        return this.props.search;
    }
    get department(): string | undefined {
        return this.props.department;
    }
    get municipality(): string | undefined {
        return this.props.municipality;
    }
    get status(): Status | undefined {
        return this.props.status;
    }
    get period(): DatePeriod | undefined {
        return this.props.period;
    }
    static fromDto(dto: RegionsFilterDto): RegionsFilterVo {
        return new RegionsFilterVo(dto);
    }
}
