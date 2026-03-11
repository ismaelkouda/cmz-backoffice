import { DepartmentsByRegionIdFilterDto } from '@pages/administrative-boundary/application/dto/regions/departments-by-region-id-filter.dto';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class DepartmentsByRegionIdFilterVo {
    public readonly uniqId: string;
    public readonly search?: string;
    public readonly region?: string;
    public readonly municipality?: string;
    public readonly status?: string;
    public readonly period?: DatePeriod;

    constructor(props: {
        uniqId: string;
        search?: string;
        region?: string;
        municipality?: string;
        status?: string;
        period?: DatePeriod;
    }) {
        this.uniqId = props.uniqId;
        this.search = props.search;
        this.region = props.region;
        this.municipality = props.municipality;
        this.status = props.status;
        this.period = props.period;
    }

    static fromDto(
        dto: DepartmentsByRegionIdFilterDto | null
    ): DepartmentsByRegionIdFilterVo {
        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }
        return new DepartmentsByRegionIdFilterVo({
            uniqId: dto?.uniqId.trim() ?? '',
            search: dto?.search?.trim() || undefined,
            municipality: dto?.municipality,
            status: dto?.status,
            period,
        });
    }
}
