import { DashboardFilterDto } from '@pages/dashboard/application/dto/dashboard-filter.dto';
import { InvalidFilterError } from '@shared/domain/errors/filter.error';

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
