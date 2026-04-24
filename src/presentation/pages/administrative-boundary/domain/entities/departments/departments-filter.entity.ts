import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';
import { DepartmentsFilterProps } from '@pages/administrative-boundary/domain/interfaces/departments/departments-filter-props.interface';
import { DepartmentsFilterVo } from '@pages/administrative-boundary/domain/value-objects/departments/departments-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class DepartmentsFilterEntity {
    constructor(private readonly props: DepartmentsFilterProps) {}

    get search(): string | undefined {
        return this.props.search;
    }
    get region(): string | undefined {
        return this.props.region;
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

    static fromVo(props: DepartmentsFilterVo): DepartmentsFilterEntity {
        return new DepartmentsFilterEntity(props);
    }
}
