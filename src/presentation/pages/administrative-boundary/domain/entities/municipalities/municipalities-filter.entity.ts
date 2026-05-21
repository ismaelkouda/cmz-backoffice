import { MunicipalitiesFilterProps } from '@pages/administrative-boundary/domain/interfaces/municipalities/municipalities-filter-props.interface';
import { MunicipalitiesFilterVo } from '@pages/administrative-boundary/domain/value-objects/municipalities/municipalities-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class MunicipalitiesFilterEntity {
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

    static fromVo(props: MunicipalitiesFilterVo): MunicipalitiesFilterEntity {
        return new MunicipalitiesFilterEntity(props);
    }
}
