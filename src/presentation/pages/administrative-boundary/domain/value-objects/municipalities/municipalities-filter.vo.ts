import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { MunicipalitiesFilterDto } from '@presentation/pages/administrative-boundary/application/dto/municipalities/municipalities-filter.dto';
import { Status } from '@presentation/pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';

export class MunicipalitiesFilterVo {
    public readonly search?: string;
    public readonly region?: string;
    public readonly department?: string;
    public readonly status?: Status;
    public readonly period?: DatePeriod;

    constructor(props: {
        search?: string;
        region?: string;
        department?: string;
        status?: Status;
        period?: DatePeriod;
    }) {
        this.search = props.search;
        this.region = props.region;
        this.department = props.department;
        this.status = props.status;
        this.period = props.period;
    }

    static fromDto(
        dto: MunicipalitiesFilterDto | null
    ): MunicipalitiesFilterVo {
        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }
        return new MunicipalitiesFilterVo({
            search: dto?.search?.trim() || undefined,
            region: dto?.region,
            department: dto?.department,
            status: dto?.status,
            period,
        });
    }
}
