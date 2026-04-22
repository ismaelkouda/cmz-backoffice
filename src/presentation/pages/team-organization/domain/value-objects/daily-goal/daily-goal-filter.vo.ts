import { DailyGoalFilterDto } from '@pages/team-organization/application/dto/daily-goal/daily-goal-filter.dto';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class DailyGoalFilterVo {
    public readonly period?: DatePeriod;

    private constructor(props: { period?: DatePeriod }) {
        this.period = props.period;
    }

    static fromDto(dto: DailyGoalFilterDto | null): DailyGoalFilterVo {
        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new DailyGoalFilterVo({
            period,
        });
    }
}
