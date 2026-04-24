import { Status } from '@pages/administrative-boundary/domain/enums/regions/regions-status.enum';
import { RegionsFilterProps } from '@pages/administrative-boundary/domain/interfaces/regions/regions-filter-props.interface';
import { RegionsFilterVo } from '@pages/administrative-boundary/domain/value-objects/regions/regions-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class RegionsFilterEntity {
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
    static fromVo(vo: RegionsFilterVo): RegionsFilterEntity {
        return new RegionsFilterEntity(vo);
    }
}
