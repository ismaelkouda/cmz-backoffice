import { Status } from '@pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';
import { MunicipalitiesByDepartmentIdFilterProps } from '@pages/administrative-boundary/domain/interfaces/departments/municipalities-by-department-id-filter-props.interface';
import { MunicipalitiesByDepartmentIdFilterVo } from '@pages/administrative-boundary/domain/value-objects/departments/municipalities-by-department-id-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class MunicipalitiesByDepartmentIdFilterEntity {
    constructor(
        private readonly props: MunicipalitiesByDepartmentIdFilterProps
    ) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
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

    static fromVo(
        props: MunicipalitiesByDepartmentIdFilterVo
    ): MunicipalitiesByDepartmentIdFilterEntity {
        return new MunicipalitiesByDepartmentIdFilterEntity(props);
    }
}
