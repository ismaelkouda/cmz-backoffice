import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { MunicipalitiesByDepartmentIdFilterDto } from '@presentation/pages/administrative-boundary/application/dto/departments/municipalities-by-department-id-filter.dto';

export class MunicipalitiesByDepartmentIdFilterVo {
    public readonly uniqId: string;
    public readonly search?: string;
    public readonly region?: string;
    public readonly department?: string;
    public readonly status?: string;
    public readonly period?: DatePeriod;

    constructor(props: {
        uniqId: string;
        search?: string;
        region?: string;
        department?: string;
        status?: string;
        period?: DatePeriod;
    }) {
        this.uniqId = props.uniqId;
        this.search = props.search;
        this.region = props.region;
        this.department = props.department;
        this.status = props.status;
        this.period = props.period;
    }

    static fromDto(
        dto: MunicipalitiesByDepartmentIdFilterDto
    ): MunicipalitiesByDepartmentIdFilterVo {
        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }
        return new MunicipalitiesByDepartmentIdFilterVo({
            uniqId: dto?.uniqId.trim() ?? '',
            search: dto?.search?.trim() || undefined,
            region: dto?.region,
            department: dto?.department,
            status: dto?.status,
            period,
        });
    }
}
