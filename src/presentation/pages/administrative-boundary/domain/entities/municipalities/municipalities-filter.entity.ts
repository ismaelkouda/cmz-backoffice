import { Status } from '@pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';
import { MunicipalitiesFilterProps } from '@pages/administrative-boundary/domain/interfaces/municipalities/municipalities-filter-props.interface';
import { MunicipalitiesFilterVo } from '@pages/administrative-boundary/domain/value-objects/municipalities/municipalities-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class MunicipalitiesFilterEntity {
    constructor(private readonly props: MunicipalitiesFilterProps) {}

    get search(): string | undefined {
        return this.props.search;
    }
    get region(): string | undefined {
        return this.props.region;
    }
    get department(): string | undefined {
        return this.props.department;
    }
    get status(): Status | undefined {
        return this.props.status;
    }
    get period(): DatePeriod | undefined {
        return this.props.period;
    }

    static fromVo(props: MunicipalitiesFilterVo): MunicipalitiesFilterEntity {
        return new MunicipalitiesFilterEntity(props);
    }
}
