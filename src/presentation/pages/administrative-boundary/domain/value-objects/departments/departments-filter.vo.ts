import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { DepartmentsFilterDto } from '@presentation/pages/administrative-boundary/application/dto/departments/departments-filter.dto';
import { Status } from '@presentation/pages/administrative-boundary/domain/enums/departments/departments-status.enum';

export class DepartmentsFilterVo {
    public readonly search?: string;
    public readonly region?: string;
    public readonly municipality?: string;
    public readonly status?: Status;
    public readonly period?: DatePeriod;

    constructor(props: {
        search?: string;
        region?: string;
        municipality?: string;
        status?: Status;
        period?: DatePeriod;
    }) {
        this.search = props.search;
        this.region = props.region;
        this.municipality = props.municipality;
        this.status = props.status;
        this.period = props.period;
    }

    static fromDto(dto: DepartmentsFilterDto | null): DepartmentsFilterVo {
        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }
        return new DepartmentsFilterVo({
            search: dto?.search?.trim() || undefined,
            region: dto?.region,
            municipality: dto?.municipality,
            status: dto?.status,
            period,
        });
    }
}
