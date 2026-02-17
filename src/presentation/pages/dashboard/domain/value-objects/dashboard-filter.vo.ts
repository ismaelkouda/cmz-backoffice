import { InvalidFilterError } from '@shared/domain/errors/filter.error';

import { DashboardFilterDto } from '@presentation/pages/dashboard/application/dto/dashboard-filter.dto';

export class DashboardFilterVo {
    public readonly period: string;

    private constructor(props: { period: string }) {
        const validPeriod = Number(props.period);

        if (validPeriod < 1) {
            throw new InvalidFilterError('DASHBOARD.FILTER.PERIOD.INVALID');
        }
        this.period = props.period;
    }

    static fromDto(dto: DashboardFilterDto): DashboardFilterVo {
        return new DashboardFilterVo({
            period: dto.period,
        });
    }
}
