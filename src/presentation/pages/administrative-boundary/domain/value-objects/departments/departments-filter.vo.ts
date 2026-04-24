import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';
import { DepartmentsFilterProps } from '@pages/administrative-boundary/domain/interfaces/departments/departments-filter-props.interface';
import { DepartmentsFilterDto } from '@presentation/pages/administrative-boundary/application/dto/departments/departments-filter.dto';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class DepartmentsFilterVo {
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

    static fromDto(dto: DepartmentsFilterDto | null): DepartmentsFilterVo {
        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new DepartmentsFilterVo({
            search: dto?.search,
            region: dto?.region,
            municipality: dto?.municipality,
            status: dto?.status,
            period,
        });
    }
}
