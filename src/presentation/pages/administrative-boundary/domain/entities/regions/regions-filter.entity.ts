import { RegionsFilterProps } from '@pages/administrative-boundary/domain/interfaces/regions/regions-filter-props.interface';
import { RegionsFilterVo } from '@pages/administrative-boundary/domain/value-objects/regions/regions-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class RegionsFilterEntity {
    constructor(private readonly props: RegionsFilterProps) {}

    get search(): string | null {
        return this.props.search;
    }
    get period(): DatePeriod | null {
        return this.props.period;
    }
    static fromVo(vo: RegionsFilterVo): RegionsFilterEntity {
        return new RegionsFilterEntity(vo);
    }
}
