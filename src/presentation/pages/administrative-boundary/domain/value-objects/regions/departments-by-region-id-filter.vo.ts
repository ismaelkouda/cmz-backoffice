import { DepartmentsByRegionIdFilterDto } from '@pages/administrative-boundary/application/dto/regions/departments-by-region-id-filter.dto';
import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';
import { DepartmentsByRegionIdFilterProps } from '@pages/administrative-boundary/domain/interfaces/regions/departments-by-region-id-filter-props.interface';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';
export class DepartmentsByRegionIdFilterVo {
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

    static fromDto(
        dto: DepartmentsByRegionIdFilterDto
    ): DepartmentsByRegionIdFilterVo {
        return new DepartmentsByRegionIdFilterVo(dto);
    }
}
