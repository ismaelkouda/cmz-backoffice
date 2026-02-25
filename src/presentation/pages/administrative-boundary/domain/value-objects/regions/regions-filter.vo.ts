import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { RegionsFilterDto } from '@presentation/pages/administrative-boundary/application/dto/regions/regions-filter.dto';
import { Status } from '@presentation/pages/administrative-boundary/domain/enums/regions/regions-status.enum';

export class RegionsFilterVo {
    public readonly search?: string;
    public readonly department?: string;
    public readonly municipality?: string;
    public readonly status?: Status;
    public readonly period?: DatePeriod;

    constructor(props: {
        search?: string;
        department?: string;
        municipality?: string;
        status?: Status;
        period?: DatePeriod;
    }) {
        this.search = props.search;
        this.department = props.department;
        this.municipality = props.municipality;
        this.status = props.status;
        this.period = props.period;
    }

    static fromDto(dto: RegionsFilterDto | null): RegionsFilterVo {
        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }
        return new RegionsFilterVo({
            search: dto?.search?.trim() || undefined,
            department: dto?.department,
            municipality: dto?.municipality,
            status: dto?.status,
            period,
        });
    }
}
