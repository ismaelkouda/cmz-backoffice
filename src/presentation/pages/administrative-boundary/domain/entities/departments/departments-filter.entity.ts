import { DepartmentsFilterProps } from '@pages/administrative-boundary/domain/interfaces/departments/departments-filter-props.interface';
import { DepartmentsFilterVo } from '@pages/administrative-boundary/domain/value-objects/departments/departments-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class DepartmentsFilterEntity {
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

    static fromVo(props: DepartmentsFilterVo): DepartmentsFilterEntity {
        return new DepartmentsFilterEntity(props);
    }
}
