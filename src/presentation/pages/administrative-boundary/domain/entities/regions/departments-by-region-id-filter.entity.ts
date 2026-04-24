import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';
import { DepartmentsByRegionIdFilterProps } from '@pages/administrative-boundary/domain/interfaces/regions/departments-by-region-id-filter-props.interface';
import { DepartmentsByRegionIdFilterVo } from '@pages/administrative-boundary/domain/value-objects/regions/departments-by-region-id-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class DepartmentsByRegionIdFilterEntity {
    constructor(private readonly props: DepartmentsByRegionIdFilterProps) {}
    get uniqId(): string {
        return this.props.uniqId;
    }
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

    static fromVo(
        vo: DepartmentsByRegionIdFilterVo
    ): DepartmentsByRegionIdFilterEntity {
        return new DepartmentsByRegionIdFilterEntity(vo);
    }
}
